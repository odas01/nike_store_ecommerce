import { privateClient } from '@/api/config';

import { AllSizes, ISize, SizeFormValues } from '@/types';

export const sizeApi = {
   getAll: async (params?: any) =>
      (await privateClient.get<AllSizes>('sizes', { params })).data,

   create: async (data: SizeFormValues) =>
      (await privateClient.post<ISize>('sizes', data)).data,
   update: async (id: string, data: SizeFormValues) =>
      (await privateClient.put<ISize>(`sizes/${id}`, data)).data,
   delete: async (id: string) =>
      (await privateClient.delete<{}>(`sizes/${id}`)).data,
};
