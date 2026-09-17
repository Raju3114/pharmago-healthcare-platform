import { Platform } from 'react-native';

// For Android emulator: 10.0.2.2 points to host machine localhost
// For iOS simulator / Web / Physical Device: localhost or local IP
const LOCAL_HOST = Platform.OS === 'android' ? '10.0.2.2' : 'localhost';

export const ENV = {
  API_BASE_URL: `http://${LOCAL_HOST}:8080/api/v1`,
  TIMEOUT: 15000,
  IMAGE_BASE_URL: `http://${LOCAL_HOST}:8080`
};
