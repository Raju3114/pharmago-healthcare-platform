package com.pharmago.service.ai;

public interface AIProvider {

    String generateResponse(String systemPrompt, String userMessage);

    String getProviderName();
}
