import { apiClient } from '../api/apiClient';
import { ApiResponse, PageResponse } from '../types/api.types';
import { CheckoutPayload, Order } from '../types/order.types';

export const orderService = {
  checkout: async (payload: CheckoutPayload): Promise<Order> => {
    const response = await apiClient.post<ApiResponse<Order>>('/orders/checkout', payload);
    return response.data.data;
  },

  getUserOrders: async (pageNo = 0, pageSize = 10): Promise<PageResponse<Order>> => {
    const response = await apiClient.get<ApiResponse<PageResponse<Order>>>('/orders', {
      params: { pageNo, pageSize }
    });
    return response.data.data;
  },

  getOrderById: async (id: number): Promise<Order> => {
    const response = await apiClient.get<ApiResponse<Order>>(`/orders/${id}`);
    return response.data.data;
  }
};
