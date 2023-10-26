import { privateClient } from '@/api/config';
import { CartUpload, ICartItem } from '@/types';

export const cartApi = {
   get: async () =>
      (await privateClient.get<{ items: ICartItem[]; total: number }>(`cart`))
         .data,
   create: async (data: CartUpload) =>
      (await privateClient.post<ICartItem[]>(`cart`, data)).data,
   delete: async () => await privateClient.delete(`cart`),
   updateItem: async (itemId: string, data: CartUpload) =>
      (await privateClient.put<ICartItem>(`cart/${itemId}`, data)).data,
   deleteItems: async (listId: string[]) =>
      await privateClient.delete(`cart`, { data: { listId } }),
};
