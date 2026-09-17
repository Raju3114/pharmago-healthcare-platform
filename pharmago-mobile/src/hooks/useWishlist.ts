import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { wishlistService } from '../services/wishlistService';

export const useWishlist = () => {
  const queryClient = useQueryClient();

  const wishlistQuery = useQuery({
    queryKey: ['wishlist'],
    queryFn: () => wishlistService.getWishlist()
  });

  const addToWishlistMutation = useMutation({
    mutationFn: (medicineId: number) => wishlistService.addToWishlist(medicineId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
    }
  });

  const removeFromWishlistMutation = useMutation({
    mutationFn: (medicineId: number) => wishlistService.removeFromWishlist(medicineId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
    }
  });

  return {
    wishlist: wishlistQuery.data || [],
    isLoading: wishlistQuery.isLoading,
    refetch: wishlistQuery.refetch,
    isRefetching: wishlistQuery.isRefetching,
    addToWishlist: addToWishlistMutation.mutateAsync,
    removeFromWishlist: removeFromWishlistMutation.mutateAsync
  };
};
