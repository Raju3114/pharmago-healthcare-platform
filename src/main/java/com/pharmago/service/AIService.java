package com.pharmago.service;

import com.pharmago.dto.request.ChatRequestDto;
import com.pharmago.dto.response.ChatResponseDto;

public interface AIService {

    ChatResponseDto processChat(ChatRequestDto request);
}
