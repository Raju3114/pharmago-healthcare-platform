import { apiClient } from '../api/apiClient';
import { ApiResponse } from '../types/api.types';
import { Medicine } from '../types/medicine.types';

export interface WishlistItem {
  id: number;
  medicine: Medicine;
  createdAt: string;
}

export const wishlistService = {
  getWishlist: async (): Promise<WishlistItem[]> => {
    const response = await apiClient.get<ApiResponse<WishlistItem[]>>('/wishlist');
    return response.data.data;
  },

  addToWishlist: async (medicineId: number): Promise<WishlistItem> => {
    const response = await apiClient.post<ApiResponse<WishlistItem>>(`/wishlist/${medicineId}`);
    return response.data.data;
  },

  removeFromWishlist: async (medicineId: number): Promise<void> => {
    await apiClient.delete(`/wishlist/${medicineId}`);
  }
};
