package com.pharmago.controller;

import com.pharmago.dto.request.ChatRequestDto;
import com.pharmago.dto.response.ApiResponseDto;
import com.pharmago.dto.response.ChatResponseDto;
import com.pharmago.service.AIService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/ai")
@RequiredArgsConstructor
public class AIController {

    private final AIService aiService;

    @PostMapping("/chat")
    public ResponseEntity<ApiResponseDto<ChatResponseDto>> chat(@Valid @RequestBody ChatRequestDto request) {
        ChatResponseDto chatResponse = aiService.processChat(request);
        return ResponseEntity.ok(ApiResponseDto.success("AI response generated successfully", chatResponse));
    }
}
