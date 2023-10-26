import { privateClient } from '@/api/config';
import { AllUsers, IUser, UserFormUpdate } from '@/types';

export const userApi = {
   get: async (id: string) =>
      (await privateClient.get<IUser>(`users/${id}`)).data,
   getAll: async (params: any) =>
      (await privateClient.get<AllUsers>('users', { params })).data,

   update: async (id: string, data: UserFormUpdate) =>
      (await privateClient.put<IUser>(`users/${id}`, data)).data,
   delete: async (id: string) =>
      (await privateClient.delete<{}>(`users/${id}`)).data,
};
