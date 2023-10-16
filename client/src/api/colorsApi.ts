import { privateClient, publicClient } from '@/api/config';
import { AllColors, IColor } from '@/types';
import { ColorFormValues } from '@/types';

export const colorApi = {
   getAll: async (params?: any) =>
      (await publicClient.get<AllColors>('colors', { params })).data,

   create: async (values: ColorFormValues) =>
      (await privateClient.post<IColor>('colors', values)).data,
   update: async (id: string, values: ColorFormValues) =>
      (await privateClient.put<IColor>(`colors/${id}`, values)).data,
   delete: async (id: string) =>
      (await privateClient.delete<IColor>(`colors/${id}`)).data,
};
