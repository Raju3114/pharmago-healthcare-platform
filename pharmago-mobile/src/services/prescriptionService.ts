import { apiClient } from '../api/apiClient';
import { ApiResponse } from '../types/api.types';
import { Prescription } from '../types/prescription.types';

export const prescriptionService = {
  getPrescriptions: async (): Promise<Prescription[]> => {
    const response = await apiClient.get<ApiResponse<Prescription[]>>('/prescriptions');
    return response.data.data;
  },

  getPrescriptionById: async (id: number): Promise<Prescription> => {
    const response = await apiClient.get<ApiResponse<Prescription>>(`/prescriptions/${id}`);
    return response.data.data;
  },

  uploadPrescription: async (formData: FormData): Promise<Prescription> => {
    const response = await apiClient.post<ApiResponse<Prescription>>('/prescriptions/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data.data;
  }
};
