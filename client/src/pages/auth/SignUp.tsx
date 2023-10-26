import { Button, Error, Input } from '@/components';
import React, { FC } from 'react';
import { BsGoogle } from 'react-icons/bs';
import { useGoogleLogin } from '@react-oauth/google';
import * as zod from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import authStore from '@/stores/authStore';
import { useMutation } from '@tanstack/react-query';
import { authApi } from '@/api';
import { ErrorResponse, ILogin, ISignUp } from '@/types';
import { notify } from '@/helpers';
import DotLoader from 'react-spinners/DotLoader';
import { twMerge } from 'tailwind-merge';
import { useTranslation } from 'react-i18next';
import cartStore from '@/stores/cartStore';
import { Link, useNavigate } from 'react-router-dom';

const formSchema = zod
   .object({
      name: zod.string().nonempty('Name is required!'),
      email: zod.string().nonempty('Email is required!').email('Invalid email'),
      password: zod.string().nonempty('Password is required!'),
      confirmPassword: zod.string().nonempty('Password is required!'),
   })
   .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords don't match",
      path: ['confirmPassword'],
   });
type SignupFormValues = zod.infer<typeof formSchema>;

const SignUp = () => {
   const { setCurrentUser, saveToken } = authStore();
   const { t } = useTranslation(['home', 'mutual']);
   const { getCart } = cartStore();
   const navigate = useNavigate();
   const {
      register,
      handleSubmit,
      formState: { errors },
   } = useForm<SignupFormValues>({
      resolver: zodResolver(formSchema),
      mode: 'onChange',
   });

   const signupMutation = useMutation({
      mutationFn: (values: ISignUp) => authApi.signup(values),
      onSuccess: () => {
         notify('success', `Sign up succesfully`);
         navigate('/login');
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
         getCart();
         notify('success', `Welcome ${user.name} to Nike Store`);
         navigate('/');
      },

      onError: (error: ErrorResponse) => {
         notify('error', error.message);
      },
   });

   const googleLogin = useGoogleLogin({
      onSuccess: async (response) => {
         googleLoginMutation.mutate(response.access_token);
      },
   });
   const onSubmit = handleSubmit(async (values: any) => {
      const { confirmPassword, ...newValues } = values;
      signupMutation.mutate(newValues);
   });

   return (
      <div className='space-y-10'>
         <h3 className='text-2xl text-center'>
            {t('action.signup', { ns: 'mutual' })}
         </h3>
         <div className='w-full rounded-md shadow-lg px-7 py-8 bg-white'>
            <div className='space-y-3'>
               <div className='flex flex-col'>
                  <span className='text-13'>
                     {t('label.name', { ns: 'mutual' })}
                  </span>
                  <Input
                     placeholder={t('placeHolder.typeYourName')}
                     {...register('name')}
                     isError={!!errors.name}
                  />
                  <Error message={errors?.name && errors.name.message} />
               </div>
               <div className='flex flex-col'>
                  <span className='text-13'>Email</span>
                  <Input
                     placeholder={t('placeHolder.typeEmail')}
                     {...register('email')}
                     isError={!!errors.email}
                  />
                  <Error message={errors?.email && errors.email.message} />
               </div>
               <div className='flex flex-col'>
                  <span className='text-13'>
                     {t('label.password', { ns: 'mutual' })}
                  </span>
                  <Input
                     type='password'
                     placeholder={t('placeHolder.typePassword')}
                     {...register('password')}
                     isError={!!errors.password}
                  />
                  <Error
                     message={errors?.password && errors.password.message}
                  />
               </div>
               <div className='flex flex-col'>
                  <span className='text-13'>{t('confirmPass')}</span>
                  <Input
                     type='password'
                     placeholder={t('placeHolder.typePasswordAgain')}
                     {...register('confirmPassword')}
                     isError={!!errors.confirmPassword}
                  />
                  <Error
                     message={
                        errors?.confirmPassword &&
                        errors.confirmPassword.message
                     }
                  />
               </div>
            </div>
            <Button
               className={twMerge(
                  'w-full h-12 mt-6 bg-[#03C7EF] hover:bg-[#51b5c9] rounded flex justify-center items-center space-x-2',
                  signupMutation.isLoading &&
                     'cursor-not-allowed bg-[#316e9c] select-none'
               )}
               disabled={signupMutation.isLoading}
               onClick={onSubmit}
            >
               {signupMutation.isLoading && (
                  <DotLoader color='#fff' size={20} />
               )}
               <span>{t('action.signup', { ns: 'mutual' })}</span>
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
            <div className='mt-8 space-x-1 text-xs text-center'>
               <span className='text-[#7e7e7e]'> {t('haveAccount?')}</span>
               <span
                  className='text-[#4f4f4f] font-semibold duration-150 hover:text-[#3c3c3c] cursor-pointer'
                  onClick={() => navigate('/login')}
               >
                  {t('action.login', { ns: 'mutual' })}
               </span>
            </div>
         </div>
      </div>
   );
};

export default SignUp;
