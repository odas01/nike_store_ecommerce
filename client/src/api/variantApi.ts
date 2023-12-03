import { privateClient } from '@/api/config';
import { VariantResponse, VariantForm, IMessage } from '@/types';

export const variantApi = {
   create: async (data: VariantForm) =>
      (await privateClient.post<VariantResponse>('variant', data)).data,
   update: async (id: string, data: VariantForm) =>
      (await privateClient.put<VariantResponse>(`variant/${id}`, data)).data,
   delete: async (id: string) =>
      (await privateClient.delete<IMessage>(`variant/${id}`)).data,
};
