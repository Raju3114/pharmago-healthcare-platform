import { useQuery } from '@tanstack/react-query';
import { medicineService } from '../services/medicineService';
import { MedicineFilterParams } from '../types/medicine.types';

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => medicineService.getCategories()
  });
};

export const useMedicines = (params: MedicineFilterParams = {}) => {
  return useQuery({
    queryKey: ['medicines', params],
    queryFn: () => medicineService.getMedicines(params)
  });
};

export const useMedicineDetail = (id: number) => {
  return useQuery({
    queryKey: ['medicine', id],
    queryFn: () => medicineService.getMedicineById(id),
    enabled: !!id
  });
};

export const useSearchMedicines = (query: string) => {
  return useQuery({
    queryKey: ['search-medicines', query],
    queryFn: () => medicineService.searchMedicines(query),
    enabled: query.trim().length > 0
  });
};
