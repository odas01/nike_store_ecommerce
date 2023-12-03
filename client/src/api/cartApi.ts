import { privateClient } from '@/api/config';
import { CartItemUpLoad, CartResponse, ICartItem, IMessage } from '@/types';

export const cartApi = {
   get: async () => (await privateClient.get<CartResponse>(`cart`)).data,
   addItem: async (data: CartItemUpLoad) =>
      (await privateClient.post<IMessage>(`cart`, data)).data,
   delete: async () => await privateClient.delete(`cart`),
   updateItem: async (itemId: string, data: CartItemUpLoad) =>
      (await privateClient.put<ICartItem>(`cart/${itemId}`, data)).data,
   deleteItems: async (listId: string[]) =>
      await privateClient.delete<{}>(`cart`, { data: { listId } }),
};
