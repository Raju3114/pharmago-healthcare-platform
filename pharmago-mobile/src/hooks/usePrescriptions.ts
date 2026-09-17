import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { prescriptionService } from '../services/prescriptionService';

export const usePrescriptions = () => {
  const queryClient = useQueryClient();

  const prescriptionsQuery = useQuery({
    queryKey: ['prescriptions'],
    queryFn: () => prescriptionService.getPrescriptions()
  });

  const uploadMutation = useMutation({
    mutationFn: (formData: FormData) => prescriptionService.uploadPrescription(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prescriptions'] });
    }
  });

  return {
    prescriptions: prescriptionsQuery.data || [],
    isLoading: prescriptionsQuery.isLoading,
    refetch: prescriptionsQuery.refetch,
    isRefetching: prescriptionsQuery.isRefetching,
    uploadPrescription: uploadMutation.mutateAsync,
    isUploading: uploadMutation.isPending
  };
};

export const usePrescriptionDetail = (id: number) => {
  return useQuery({
    queryKey: ['prescription', id],
    queryFn: () => prescriptionService.getPrescriptionById(id),
    enabled: !!id
  });
};
