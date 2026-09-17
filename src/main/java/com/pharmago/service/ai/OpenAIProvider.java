package com.pharmago.service.ai;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Slf4j
@Component
@RequiredArgsConstructor
public class OpenAIProvider implements AIProvider {

    private final RestTemplate aiRestTemplate;

    @Value("${app.ai.openai.api-key:demo}")
    private String apiKey;

    @Value("${app.ai.openai.model:gpt-3.5-turbo}")
    private String model;

    @Value("${app.ai.openai.api-url:https://api.openai.com/v1/chat/completions}")
    private String apiUrl;

    @Override
    public String getProviderName() {
        return "OpenAIProvider";
    }

    @Override
    public String generateResponse(String systemPrompt, String userMessage) {
        if (!StringUtils.hasText(apiKey) || "demo".equalsIgnoreCase(apiKey) || "mock_key".equalsIgnoreCase(apiKey)) {
            log.warn("OpenAI API key not configured. Using fallback Health Knowledge Assistant response.");
            return generateFallbackResponse(userMessage);
        }

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(apiKey);

            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("model", model);

            List<Map<String, String>> messages = new ArrayList<>();
            messages.add(Map.of("role", "system", "content", systemPrompt));
            messages.add(Map.of("role", "user", "content", userMessage));

            requestBody.put("messages", messages);
            requestBody.put("temperature", 0.7);
            requestBody.put("max_tokens", 500);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
            ResponseEntity<Map> responseEntity = aiRestTemplate.postForEntity(apiUrl, entity, Map.class);

            if (responseEntity.getStatusCode().is2xxSuccessful() && responseEntity.getBody() != null) {
                Map body = responseEntity.getBody();
                List choices = (List) body.get("choices");
                if (choices != null && !choices.isEmpty()) {
                    Map firstChoice = (Map) choices.get(0);
                    Map message = (Map) firstChoice.get("message");
                    if (message != null && message.containsKey("content")) {
                        return (String) message.get("content");
                    }
                }
            }
        } catch (Exception e) {
            log.error("Error communicating with OpenAI API: {}", e.getMessage());
        }

        return generateFallbackResponse(userMessage);
    }

    private String generateFallbackResponse(String userMessage) {
        String query = userMessage.toLowerCase();

        if (query.contains("paracetamol") || query.contains("acetaminophen")) {
            return "Paracetamol (Acetaminophen) is a widely used over-the-counter pain reliever and fever reducer. It is commonly used for headaches, muscle aches, toothaches, and reducing fever. Standard adult dosage is typically 500mg to 1000mg every 4 to 6 hours as needed, not exceeding 4000mg in 24 hours.";
        } else if (query.contains("vitamin d") || query.contains("vitamin d3")) {
            return "Vitamin D is essential for calcium absorption, bone health, and immune function support. It is best taken with a fat-containing meal for optimal absorption. Daily requirements vary by age, typically ranging from 600 IU to 2000 IU daily depending on individual health status.";
        } else if (query.contains("headache") || query.contains("headaches")) {
            return "Headaches can stem from stress, dehydration, lack of sleep, eye strain, or sinus pressure. Staying hydrated, resting in a quiet dark room, and gentle neck stretches can help relieve tension headaches.";
        } else {
            return "PharmaGo Health Assistant provides educational information regarding medicine compositions, general dosage guidance, and common wellness habits. For your query '" + userMessage + "', please consult a licensed physician or pharmacist for personalized medical guidance.";
        }
    }
}
