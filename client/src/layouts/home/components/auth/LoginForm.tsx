import { Button, Error, Input } from '@/components';
import React, { FC, useContext } from 'react';
import { BsGoogle } from 'react-icons/bs';
import { useGoogleLogin } from '@react-oauth/google';
import * as zod from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import authStore from '@/stores/authStore';
import { useMutation } from '@tanstack/react-query';
import { authApi } from '@/api';
import { ErrorResponse } from '@/types';
import { notify } from '@/helpers';
import DotLoader from 'react-spinners/DotLoader';
import { twMerge } from 'tailwind-merge';
import { useTranslation } from 'react-i18next';

const formSchema = zod.object({
   email: zod.string().nonempty('Email is required!').email('Invalid email'),
   password: zod.string().nonempty('Password is required!'),
});

type LoginFormValues = zod.infer<typeof formSchema>;

const LoginForm: FC<{
   setIsLoginForm: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ setIsLoginForm }) => {
   const { setCurrentUser, saveToken } = authStore();
   const { t } = useTranslation(['home', 'mutual']);
   const {
      register,
      handleSubmit,
      formState: { errors },
      reset,
   } = useForm<LoginFormValues>({
      resolver: zodResolver(formSchema),
      mode: 'onChange',
   });

   const loginMutation = useMutation({
      mutationFn: (values) => authApi.login(values),
      onSuccess: ({ user, token }) => {
         saveToken(token);
         setCurrentUser(user);
         notify('success', `Welcome ${user.name} to Nike Store`);
      },

      onError: (error: ErrorResponse) => {
         notify('error', error.message);
      },
   });

   const googleLoginMutation = useMutation({
      mutationFn: (token: string) => authApi.googleLogin(token),
      onSuccess: ({ user, token }) => {
         saveToken(token);
         setCurrentUser(user);
         notify('success', `Welcome ${user.name} to Nike Store`);
      },

      onError: (error: ErrorResponse) => {
         notify('error', error.message);
      },
   });

   const onSubmit = handleSubmit(async (values: any) => {
      loginMutation.mutate(values);
   });

   const googleLogin = useGoogleLogin({
      onSuccess: async (response) => {
         googleLoginMutation.mutate(response.access_token);
         console.log(response);

         // const res = await loginWithGoogle(response.access_token);
         // if (res.success) {
         //    navigate('/');
         //    toast('success', 'Login successfully');
         // }
         // setLoading(false);
      },
   });

   return (
      <form onSubmit={onSubmit} className='flex flex-col h-full'>
         <div className='[&_label]:text-sm [&_label]:font-normal [&>div]:space-y-1'>
            <div className='flex flex-col'>
               <label htmlFor='email'>Email</label>
               <Input
                  placeholder={t('placeHolder.typeEmail')}
                  {...register('email')}
                  isError={!!errors.email}
                  disabled={loginMutation.isLoading}
               />
               <Error message={errors.email?.message} />
            </div>
            <div className='flex flex-col'>
               <label htmlFor='password'>Password</label>
               <Input
                  placeholder={t('placeHolder.typePassword')}
                  {...register('password')}
                  isError={!!errors.password}
                  disabled={loginMutation.isLoading}
               />
               <Error message={errors.password?.message} />
            </div>
         </div>
         <Button
            className={twMerge(
               'w-full py-3 mt-4 bg-[#3085C3] hover:bg-[#316e9c] flex justify-center items-center space-x-2',
               loginMutation.isLoading &&
                  'cursor-not-allowed bg-[#316e9c] select-none'
            )}
            disabled={loginMutation.isLoading}
         >
            {loginMutation.isLoading && <DotLoader color='#fff' size={20} />}
            <span>{t('action.login', { ns: 'mutual' })}</span>
         </Button>
         <p className='mt-4 text-xs font-normal text-center text-gray-800'>
            {t('orLoginWith')}
         </p>
         <div className='flex justify-center mt-2'>
            <div
               className='p-2 bg-red-400 rounded-full cursor-pointer'
               onClick={() => googleLogin()}
            >
               <BsGoogle color='#fff' />
            </div>
         </div>
         <div className='mt-8 space-x-1 text-sm text-center'>
            <span className='text-[#7e7e7e]'>{t('dontaccount?')}</span>
            <span
               className='text-[#4f4f4f] font-semibold duration-150 hover:text-[#3c3c3c] cursor-pointer'
               onClick={() => !loginMutation.isLoading && setIsLoginForm(false)}
            >
               {t('action.signup', { ns: 'mutual' })}
            </span>
         </div>
      </form>
   );
};

export default LoginForm;
