import apiClient from '../api/apiClient';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

export interface ChatResponse {
  answer: string;
  disclaimer: string;
  timestamp: string;
}

export const aiService = {
  askAssistant: async (message: string): Promise<ChatResponse> => {
    const response = await apiClient.post<ChatResponse>('/ai/chat', { message });
    return response.data;
  }
};
