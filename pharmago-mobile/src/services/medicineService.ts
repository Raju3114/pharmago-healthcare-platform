import { apiClient } from '../api/apiClient';
import { ApiResponse, PageResponse } from '../types/api.types';
import { Category, Medicine, MedicineFilterParams } from '../types/medicine.types';

export const medicineService = {
  getCategories: async (): Promise<Category[]> => {
    const response = await apiClient.get<ApiResponse<Category[]>>('/categories');
    return response.data.data;
  },

  getMedicines: async (params: MedicineFilterParams = {}): Promise<PageResponse<Medicine>> => {
    const response = await apiClient.get<ApiResponse<PageResponse<Medicine>>>('/medicines', {
      params: {
        categoryId: params.categoryId,
        prescriptionRequired: params.prescriptionRequired,
        inStockOnly: params.inStockOnly,
        searchQuery: params.searchQuery,
        pageNo: params.pageNo ?? 0,
        pageSize: params.pageSize ?? 10,
        sortBy: params.sortBy ?? 'name',
        sortDir: params.sortDir ?? 'asc'
      }
    });
    return response.data.data;
  },

  getMedicineById: async (id: number): Promise<Medicine> => {
    const response = await apiClient.get<ApiResponse<Medicine>>(`/medicines/${id}`);
    return response.data.data;
  },

  searchMedicines: async (query: string, pageNo = 0, pageSize = 10): Promise<PageResponse<Medicine>> => {
    const response = await apiClient.get<ApiResponse<PageResponse<Medicine>>>('/medicines/search', {
      params: { q: query, pageNo, pageSize }
    });
    return response.data.data;
  }
};
