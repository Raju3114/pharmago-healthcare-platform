package com.pharmago.service.impl;

import com.pharmago.dto.request.ChatRequestDto;
import com.pharmago.dto.response.ChatResponseDto;
import com.pharmago.exception.BadRequestException;
import com.pharmago.service.AIService;
import com.pharmago.service.ai.AIProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

@Service
@RequiredArgsConstructor
public class AIServiceImpl implements AIService {

    public static final String MANDATORY_DISCLAIMER = "This assistant is not a doctor and does not provide medical advice. Consult a healthcare professional.";

    private static final String SYSTEM_PROMPT = """
            You are PharmaGo Health Assistant, an AI educational advisor for a pharmacy platform.
            Your role is strictly limited to providing general educational information regarding:
            1. Medicine composition and general usage instructions.
            2. Vitamin supplements and dietary recommendations.
            3. Common symptom education (e.g. causes of headaches, dehydration).

            STRICT RULES AND GUARDRAILS:
            - You MUST NEVER diagnose diseases or medical conditions.
            - You MUST NEVER prescribe specific medications or dosage changes for specific ailments.
            - You MUST NEVER provide emergency medical advice. If a user describes severe symptoms (chest pain, breathing difficulty, severe bleeding), urge them to seek immediate emergency care.
            - You MUST NEVER replace a licensed medical professional or pharmacist.
            - Keep responses concise, objective, empathetic, and informative.
            """;

    private final AIProvider aiProvider;

    @Override
    public ChatResponseDto processChat(ChatRequestDto request) {
        if (!StringUtils.hasText(request.getMessage())) {
            throw new BadRequestException("Message prompt cannot be empty");
        }

        String aiResponse = aiProvider.generateResponse(SYSTEM_PROMPT, request.getMessage());

        return ChatResponseDto.builder()
                .response(aiResponse)
                .disclaimer(MANDATORY_DISCLAIMER)
                .build();
    }
}
