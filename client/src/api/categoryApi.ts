import { privateClient, publicClient } from '@/api/config';
import {
   AllCategories,
   CagtegoryFormValue,
   CategoryResponse,
   IMessage,
} from '@/types';

export const categoryApi = {
   getAll: async (params?: any) =>
      (await publicClient.get<AllCategories>('category', { params })).data,

   create: async (data: CagtegoryFormValue) =>
      (await privateClient.post<CategoryResponse>('category', data)).data,
   update: async (id: string, data: CagtegoryFormValue) =>
      (await privateClient.put<CategoryResponse>(`category/${id}`, data)).data,
   delete: async (id: string) =>
      (await privateClient.delete<IMessage>(`category/${id}`)).data,
};
