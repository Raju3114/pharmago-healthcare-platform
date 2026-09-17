# PharmaGo - Production Deployment & Build Guide

This document provides a comprehensive guide for building, signing, testing, and deploying the **PharmaGo React Native (Expo) Mobile Application** and **Spring Boot Backend** to production.

---

## 1. Environment Configuration

### Mobile Application (`pharmago-mobile/src/constants/env.ts`)
Set the environment URL depending on your environment:
- **Local Android Emulator:** `http://10.0.2.2:8080/api/v1`
- **Local Physical Device:** `http://<YOUR_LAN_IP>:8080/api/v1`
- **Production Server:** `https://api.pharmago.com/api/v1`

### Backend (`src/main/resources/application.yml`)
Ensure environment variables are configured in production:
```yaml
spring:
  datasource:
    url: jdbc:mysql://${DB_HOST:localhost}:3306/${DB_NAME:pharmago}?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true
    username: ${DB_USER:root}
    password: ${DB_PASS:password}
  jpa:
    hibernate:
      ddl-auto: update

jwt:
  secret: ${JWT_SECRET:404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970}
  expiration: 86400000 # 24 hours
  refresh-expiration: 604800000 # 7 days

openai:
  api-key: ${OPENAI_API_KEY:demo_key}
```

---

## 2. Firebase Cloud Messaging (FCM) Integration

To enable Push Notifications on Android and iOS:

1. **Create Firebase Project:**
   - Go to [Firebase Console](https://console.firebase.google.com/) and register `com.pharmago.app`.
   - Download `google-services.json` and place it in `pharmago-mobile/`.

2. **Configure `app.json`:**
   ```json
   {
     "expo": {
       "name": "PharmaGo",
       "slug": "pharmago",
       "android": {
         "package": "com.pharmago.app",
         "googleServicesFile": "./google-services.json"
       },
       "plugins": ["expo-notifications"]
     }
   }
   ```

3. **Register Token in App Launch:**
   ```typescript
   import * as Notifications from 'expo-notifications';
   import { Platform } from 'react-native';

   export async function registerForPushNotificationsAsync() {
     const { status: existingStatus } = await Notifications.getPermissionsAsync();
     let finalStatus = existingStatus;
     if (existingStatus !== 'granted') {
       const { status } = await Notifications.requestPermissionsAsync();
       finalStatus = status;
     }
     if (finalStatus !== 'granted') {
       return null;
     }
     const token = (await Notifications.getExpoPushTokenAsync()).data;
     return token;
   }
   ```

---

## 3. Building Android Release APK / AAB (Expo / EAS Build)

### Option A: Local Build with Expo CLI / Gradle
1. Generate Android Project:
   ```bash
   npx expo prebuild
   ```
2. Navigate to `android/` and build release APK:
   ```bash
   cd android
   ./gradlew assembleRelease
   ```
3. Build Android App Bundle (AAB for Google Play):
   ```bash
   ./gradlew bundleRelease
   ```
   The binary is generated at `android/app/build/outputs/bundle/release/app-release.aab`.

### Option B: EAS Build (Cloud CI/CD)
1. Install EAS CLI:
   ```bash
   npm install -g eas-cli
   ```
2. Login and Configure:
   ```bash
   eas login
   eas build:configure
   ```
3. Run Build:
   ```bash
   eas build --platform android --profile production
   ```

---

## 4. Keystore Creation & App Signing Guide

1. **Generate Production Keystore:**
   ```bash
   keytool -genkey -v -keystore pharmago-release-key.keystore -alias pharmago-key-alias -keyalg RSA -keysize 2048 -validity 10000
   ```
2. **Configure `android/gradle.properties`:**
   ```properties
   PHARMAGO_RELEASE_STORE_FILE=pharmago-release-key.keystore
   PHARMAGO_RELEASE_KEY_ALIAS=pharmago-key-alias
   PHARMAGO_RELEASE_STORE_PASSWORD=your_store_password
   PHARMAGO_RELEASE_KEY_PASSWORD=your_key_password
   ```

3. **Configure `android/app/build.gradle`:**
   ```groovy
   signingConfigs {
       release {
           if (project.hasProperty('PHARMAGO_RELEASE_STORE_FILE')) {
               storeFile file(PHARMAGO_RELEASE_STORE_FILE)
               storePassword PHARMAGO_RELEASE_STORE_PASSWORD
               keyAlias PHARMAGO_RELEASE_KEY_ALIAS
               keyPassword PHARMAGO_RELEASE_KEY_PASSWORD
           }
       }
   }
   buildTypes {
       release {
           signingConfig signingConfigs.release
           minifyEnabled true
           proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
       }
   }
   ```

---

## 5. Google Play Store Submission Checklist

- [x] Unique Package Name (`com.pharmago.app`)
- [x] App Icon (1024x1024 PNG) & Splash Screen
- [x] Target SDK Level 34 (Android 14)
- [x] Privacy Policy URL provided (stating health & prescription data safety)
- [x] Prescription Upload Security & HIPAA/GDPR Compliance disclosures
- [x] Signed Android App Bundle (`.aab`)
- [x] Testing across light and dark themes completed
- [x] Offline fallback and network retry validated

---

## 6. Verification & Automated Testing Commands

### Backend Verification:
```bash
mvn clean test
```

### Frontend Verification:
```bash
cd pharmago-mobile
npm test
```
