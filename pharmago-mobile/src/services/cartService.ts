import { apiClient } from '../api/apiClient';
import { ApiResponse } from '../types/api.types';
import { AddToCartPayload, Cart, UpdateCartItemPayload } from '../types/cart.types';

export const cartService = {
  getCart: async (): Promise<Cart> => {
    const response = await apiClient.get<ApiResponse<Cart>>('/cart');
    return response.data.data;
  },

  addToCart: async (payload: AddToCartPayload): Promise<Cart> => {
    const response = await apiClient.post<ApiResponse<Cart>>('/cart/items', payload);
    return response.data.data;
  },

  updateCartItem: async (itemId: number, payload: UpdateCartItemPayload): Promise<Cart> => {
    const response = await apiClient.put<ApiResponse<Cart>>(`/cart/items/${itemId}`, payload);
    return response.data.data;
  },

  removeCartItem: async (itemId: number): Promise<Cart> => {
    const response = await apiClient.delete<ApiResponse<Cart>>(`/cart/items/${itemId}`);
    return response.data.data;
  },

  clearCart: async (): Promise<Cart> => {
    const response = await apiClient.delete<ApiResponse<Cart>>('/cart/clear');
    return response.data.data;
  }
};
