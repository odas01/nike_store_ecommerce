import axios from 'axios';

import { privateClient, publicClient } from '@/api/config';
import { IUser, TokenUser } from '@/types';

interface AuthResponse {
   token: TokenUser;
   user: IUser;
}

export const authApi = {
   login: async (data: any) =>
      (await publicClient.post<AuthResponse>('auth/login', data)).data,
   signup: async (data: any) =>
      (await publicClient.post('auth/signup', data)).data,
   authChecker: async () =>
      (
         await privateClient.get<{
            role: string;
            user: IUser;
         }>('auth/authChecker')
      ).data,

   adminLogin: async (data: any) =>
      (await publicClient.post<AuthResponse>('auth/admin/login', data)).data,
   adminSignUp: async (data: any) =>
      (await privateClient.post('auth/admin/signup', data)).data,

   refreshToken: async (data: any) =>
      (await privateClient.post<TokenUser>('auth/refreshToken', data)).data,

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
            .post('auth/googleLogin')
      ).data,
};
