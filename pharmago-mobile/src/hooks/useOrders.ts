import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { orderService } from '../services/orderService';
import { CheckoutPayload } from '../types/order.types';

export const useOrders = (pageNo = 0, pageSize = 10) => {
  const queryClient = useQueryClient();

  const ordersQuery = useQuery({
    queryKey: ['orders', pageNo, pageSize],
    queryFn: () => orderService.getUserOrders(pageNo, pageSize)
  });

  const checkoutMutation = useMutation({
    mutationFn: (payload: CheckoutPayload) => orderService.checkout(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    }
  });

  return {
    ordersPage: ordersQuery.data,
    isLoading: ordersQuery.isLoading,
    refetch: ordersQuery.refetch,
    isRefetching: ordersQuery.isRefetching,
    checkout: checkoutMutation.mutateAsync,
    isPlacingOrder: checkoutMutation.isPending
  };
};

export const useOrderDetail = (orderId: number) => {
  return useQuery({
    queryKey: ['order', orderId],
    queryFn: () => orderService.getOrderById(orderId),
    enabled: !!orderId
  });
};
