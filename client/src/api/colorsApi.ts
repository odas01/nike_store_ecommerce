import { privateClient, publicClient } from '@/api/config';
import { AllColors, ColorResponse, ColorFormValues, IMessage } from '@/types';

export const colorApi = {
   getAll: async (params?: any) =>
      (await publicClient.get<AllColors>('colors', { params })).data,

   create: async (values: ColorFormValues) =>
      (await privateClient.post<ColorResponse>('colors', values)).data,
   update: async (id: string, values: ColorFormValues) =>
      (await privateClient.put<ColorResponse>(`colors/${id}`, values)).data,
   delete: async (id: string) =>
      (await privateClient.delete<IMessage>(`colors/${id}`)).data,
};
