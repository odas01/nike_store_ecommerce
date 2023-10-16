import axios from 'axios';

import { authApi } from '@/api';

const privateClient = axios.create({
   baseURL: import.meta.env.VITE_APP_API,
});

privateClient.interceptors.request.use((config) => {
   const accessToken = localStorage.getItem('ACCESS_TOKEN');

   config.headers.Authorization = accessToken ? `Bearer ${accessToken}` : '';
   return config;
});

let refresh = false;

privateClient.interceptors.response.use(
   (response) => response,
   async (err) => {
      if (err.response.status === 401) {
         const refreshToken = localStorage.getItem('REFRESH_TOKEN');

         if (refreshToken && !refresh) {
            refresh = true;
            try {
               const res: any = await authApi.refreshToken({
                  rftoken: refreshToken,
               });
               localStorage.setItem('ACCESS_TOKEN', res.accessToken);
               localStorage.setItem('REFRESH_TOKEN', res.refreshToken);

               refresh = false;
               return privateClient(err.config);
            } catch (err) {
               localStorage.removeItem('ACCESS_TOKEN');
               localStorage.removeItem('REFRESH_TOKEN');

               window.location.replace('/login');
            }
         }
      }
      throw err.response.data;
   }
);

export { privateClient };
