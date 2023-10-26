import axios from 'axios';

import { privateClient, publicClient } from '@/api/config';
import {
   AuthResponse,
   IUser,
   ILogin,
   ISignUp,
   TokenUser,
   ChangePass,
} from '@/types';

export const authApi = {
   login: async (data: ILogin) =>
      (await publicClient.post<AuthResponse>('auth/login', data)).data,
   signup: async (data: ISignUp) =>
      (await publicClient.post<IUser>('auth/signup', data)).data,
   authChecker: async () =>
      (
         await privateClient.get<{
            role: string;
            user: IUser;
         }>('auth/authChecker')
      ).data,

   adminLogin: async (data: ILogin) =>
      (await publicClient.post<AuthResponse>('auth/admin/login', data)).data,
   adminSignUp: async (data: ISignUp) =>
      (await privateClient.post<IUser>('auth/admin/signup', data)).data,

   changePassword: async (data: ChangePass) =>
      (await privateClient.post<IUser>('auth/change-password', data)).data,

   forgotPassword: async (email: string) =>
      (await publicClient.post<IUser>('auth/forgot-password', { email })).data,

   resetPassword: async (password: string, id: string, token: string) =>
      (
         await privateClient.post<IUser>(`auth/reset-password/${id}/${token}`, {
            password,
         })
      ).data,

   refreshToken: async (token: string) =>
      (
         await privateClient.post<TokenUser>('auth/refreshToken', {
            token,
         })
      ).data,

   googleLogin: async (accessToken: string) =>
      (
         await axios
            .create({
               baseURL: import.meta.env.VITE_APP_API,
               headers: {
                  'Content-Type': 'application/json',
                  authorization: `Bearer ${accessToken}`,
               },
            })
            .post<AuthResponse>('auth/googleLogin')
      ).data,
};
