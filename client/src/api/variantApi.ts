import { privateClient } from '@/api/config';
import { Variant, VariantForm } from '@/types';

export const variantApi = {
   create: async (data: VariantForm) =>
      (await privateClient.post<Variant>('variant', data)).data,
   update: async (id: string, data: VariantForm) =>
      (await privateClient.put<Variant>(`variant/${id}`, data)).data,
   delete: async (id: string) =>
      (await privateClient.delete<{}>(`variant/${id}`)).data,
};
