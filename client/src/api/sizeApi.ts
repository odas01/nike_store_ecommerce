import { privateClient } from '@/api/config';
import { AllSizes, IMessage, SizeFormValues, SizeResponse } from '@/types';

export const sizeApi = {
   getAll: async (params?: any) =>
      (await privateClient.get<AllSizes>('sizes', { params })).data,

   create: async (data: SizeFormValues) =>
      (await privateClient.post<SizeResponse>('sizes', data)).data,
   update: async (id: string, data: SizeFormValues) =>
      (await privateClient.put<SizeResponse>(`sizes/${id}`, data)).data,
   delete: async (id: string) =>
      (await privateClient.delete<IMessage>(`sizes/${id}`)).data,
};
