import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cartService } from '../services/cartService';
import { AddToCartPayload, UpdateCartItemPayload } from '../types/cart.types';

export const useCart = () => {
  const queryClient = useQueryClient();

  const cartQuery = useQuery({
    queryKey: ['cart'],
    queryFn: () => cartService.getCart()
  });

  const addToCartMutation = useMutation({
    mutationFn: (payload: AddToCartPayload) => cartService.addToCart(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    }
  });

  const updateCartItemMutation = useMutation({
    mutationFn: ({ itemId, payload }: { itemId: number; payload: UpdateCartItemPayload }) =>
      cartService.updateCartItem(itemId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    }
  });

  const removeCartItemMutation = useMutation({
    mutationFn: (itemId: number) => cartService.removeCartItem(itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    }
  });

  const clearCartMutation = useMutation({
    mutationFn: () => cartService.clearCart(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    }
  });

  return {
    cart: cartQuery.data,
    isLoading: cartQuery.isLoading,
    refetch: cartQuery.refetch,
    isRefetching: cartQuery.isRefetching,
    addToCart: addToCartMutation.mutateAsync,
    isAdding: addToCartMutation.isPending,
    updateCartItem: updateCartItemMutation.mutateAsync,
    removeCartItem: removeCartItemMutation.mutateAsync,
    clearCart: clearCartMutation.mutateAsync
  };
};
