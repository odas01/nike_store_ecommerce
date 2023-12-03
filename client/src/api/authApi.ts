import axios from 'axios';

import { privateClient, publicClient } from '@/api/config';
import {
   AuthResponse,
   IUser,
   ILogin,
   ISignUp,
   TokenUser,
   ChangePass,
   LoginResponse,
   SignupResponse,
   AuthCheckResponse,
   UserResponse,
   IMessage,
} from '@/types';

export const authApi = {
   login: async (data: ILogin) =>
      (await publicClient.post<LoginResponse>('auth/login', data)).data,
   signup: async (data: ISignUp) =>
      (await publicClient.post<SignupResponse>('auth/signup', data)).data,
   authChecker: async () =>
      (await privateClient.get<AuthCheckResponse>('auth/authChecker')).data,

   adminLogin: async (data: ILogin) =>
      (await publicClient.post<LoginResponse>('auth/admin/login', data)).data,
   adminSignUp: async (data: ISignUp) =>
      (await privateClient.post<SignupResponse>('auth/admin/signup', data))
         .data,
   adminChangePassword: async (userId: string, newPassword: string) =>
      (
         await privateClient.post<SignupResponse>(
            'auth/admin/change-password',
            { userId, newPassword }
         )
      ).data,

   changePassword: async (data: ChangePass) =>
      (await privateClient.post<IMessage>('auth/change-password', data)).data,

   forgotPassword: async (email: string) =>
      (await publicClient.post<IMessage>('auth/forgot-password', { email }))
         .data,

   resetPassword: async (password: string, id: string, token: string) =>
      (
         await privateClient.post<IMessage>(
            `auth/reset-password/${id}/${token}`,
            {
               password,
            }
         )
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
            .post<LoginResponse>('auth/googleLogin')
      ).data,
};
