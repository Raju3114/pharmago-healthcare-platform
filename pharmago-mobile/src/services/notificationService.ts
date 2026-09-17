import { apiClient } from '../api/apiClient';
import { ApiResponse, PageResponse } from '../types/api.types';
import { Notification } from '../types/notification.types';

export const notificationService = {
  getNotifications: async (pageNo = 0, pageSize = 15): Promise<PageResponse<Notification>> => {
    const response = await apiClient.get<ApiResponse<PageResponse<Notification>>>('/notifications', {
      params: { pageNo, pageSize }
    });
    return response.data.data;
  },

  getUnreadCount: async (): Promise<number> => {
    const response = await apiClient.get<ApiResponse<number>>('/notifications/unread-count');
    return response.data.data;
  },

  markAsRead: async (id: number): Promise<Notification> => {
    const response = await apiClient.put<ApiResponse<Notification>>(`/notifications/${id}/read`);
    return response.data.data;
  },

  markAllAsRead: async (): Promise<void> => {
    await apiClient.put('/notifications/read-all');
  }
};
