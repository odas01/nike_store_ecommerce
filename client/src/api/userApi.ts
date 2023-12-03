import { privateClient } from '@/api/config';
import {
   AllUsers,
   UserResponse,
   UserFormUpdate,
   IUser,
   IMessage,
   UserCount,
} from '@/types';

export const userApi = {
   get: async (id: string) =>
      (await privateClient.get<IUser>(`users/${id}`)).data,
   getAll: async (params: any) =>
      (await privateClient.get<AllUsers>('users', { params })).data,

   update: async (id: string, data: UserFormUpdate) =>
      (await privateClient.put<UserResponse>(`users/${id}`, data)).data,
   delete: async (id: string) =>
      (await privateClient.delete<IMessage>(`users/${id}`)).data,

   count: async () =>
      (await privateClient.get<UserCount[]>(`users/count`)).data,
};
