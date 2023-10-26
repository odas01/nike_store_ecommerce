import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { IUser, TokenUser } from '@/types';
import { notify } from '@/helpers';
import { token } from '@/constants';
import { authApi, userApi } from '@/api';

const ACCESS_TOKEN = token.access_token;
const REFRESH_TOKEN = token.refresh_token;

type Store = {
   currentUser: IUser | null;
   isLogin: boolean;
};

type Actions = {
   logOut: () => void;
   saveToken: (token: TokenUser) => void;
   removeToken: () => void;
   setCurrentUser: (values: IUser) => void;
   updateInfo: (values: Partial<IUser>) => void;
   adminLogin: (value: any) => void;
   updateUser: (userId: string, data: any) => void;
   signinWithGoogle: (token: string) => any;
   adminAuthChecker: () => void;
};

const initialState = {
   currentUser: null,
   isLogin: false,
};

const authStore = create<Store & Actions>()(
   persist(
      (set, get) => ({
         ...initialState,
         logOut: () => {
            set({ currentUser: null, isLogin: false });
            get().removeToken();
         },
         saveToken: (token) => {
            localStorage.setItem(ACCESS_TOKEN, token.accessToken);
            localStorage.setItem(REFRESH_TOKEN, token.refreshToken);
         },
         removeToken: () => {
            localStorage.removeItem(ACCESS_TOKEN);
            localStorage.removeItem(REFRESH_TOKEN);
         },
         setCurrentUser: (values) => {
            set({
               currentUser: values,
               isLogin: true,
            });
         },
         updateInfo: (values) => {
            const user = get().currentUser;

            if (user) {
               set((state) => ({
                  currentUser: state.currentUser && {
                     ...state.currentUser,
                     ...values,
                  },
               }));
            }
         },
         adminLogin: async (value) => {
            try {
               const { user, token } = await authApi.adminLogin(value);
               console.log(user, token);

               get().saveToken(token);

               set({
                  currentUser: user,
                  isLogin: true,
               });

               notify('success', 'Welcome to dashboard');
            } catch (err: any) {
               console.log(err);

               notify('error', err.message);
            }
         },
         updateUser: async (userId, value) => {
            try {
               const user = await userApi.update(userId, value);

               set({
                  currentUser: user,
               });
            } catch (err: any) {
               notify('error', err.message);
            }
         },
         signinWithGoogle: async (token) => {
            try {
               const res = await authApi.googleLogin(token);
               // get().saveToken(token);
               set({
                  currentUser: res.user,
                  isLogin: true,
                  // isAuth: false,
               });
               return res.user;
            } catch (err) {
               return {
                  success: false,
                  err,
               };
            }
         },
         adminAuthChecker: async () => {
            try {
               const res: any = await authApi.authChecker();
               if (res.role === 'customer') {
                  get().logOut();
               }
            } catch (err) {
               console.log(err);
            }
         },
      }),
      {
         name: 'auth-store',
         // partialize: (state) => ({
         //    currentUser: state.currentUser,
         //    isLogin: state.isLogin,
         // }),
      }
   )
);

export default authStore;
