import { Button, Error, Input } from '@/components';
import { BsGoogle } from 'react-icons/bs';
import { useGoogleLogin } from '@react-oauth/google';
import * as zod from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import authStore from '@/stores/authStore';
import { useMutation } from '@tanstack/react-query';
import { authApi } from '@/api';
import { ErrorResponse, ILogin } from '@/types';
import { notify } from '@/helpers';
import DotLoader from 'react-spinners/DotLoader';
import { twMerge } from 'tailwind-merge';
import { useTranslation } from 'react-i18next';
import cartStore from '@/stores/cartStore';
import { Link, useNavigate } from 'react-router-dom';

const formSchema = zod.object({
   email: zod.string().nonempty('Email is required!').email('Invalid email'),
   password: zod.string().nonempty('Password is required!'),
});

type LoginFormValues = zod.infer<typeof formSchema>;

const Login = () => {
   const { getCart } = cartStore();
   const { setCurrentUser, saveToken } = authStore();

   const { t } = useTranslation(['home', 'mutual']);
   const navigate = useNavigate();

   const {
      register,
      handleSubmit,
      formState: { errors },
   } = useForm<LoginFormValues>({
      resolver: zodResolver(formSchema),
      mode: 'onChange',
   });

   const loginMutation = useMutation({
      mutationFn: (values: ILogin) => authApi.login(values),
      onSuccess: async ({ user, token }) => {
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

   const onSubmit = handleSubmit(async (values: any) => {
      loginMutation.mutate(values);
   });

   const googleLogin = useGoogleLogin({
      onSuccess: async (response) => {
         googleLoginMutation.mutate(response.access_token);
      },
   });

   return (
      <div className='space-y-10'>
         <h3 className='text-2xl text-center'>Login your account</h3>
         <div className='w-full rounded-md shadow-lg px-7 py-8 bg-white'>
            <div className='space-y-3'>
               <div className='flex flex-col'>
                  <span className='text-13'>Email</span>
                  <Input
                     placeholder={t('placeHolder.typeEmail')}
                     {...register('email')}
                     isError={!!errors.email}
                     disabled={loginMutation.isLoading}
                  />
                  <Error message={errors.email?.message} />
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
                     disabled={loginMutation.isLoading}
                  />
                  <Error message={errors.password?.message} />
                  <Link to='/forgot-password' className='ml-auto text-13'>
                     Forgot password?
                  </Link>
               </div>
            </div>
            <Button
               className={twMerge(
                  'w-full h-12 mt-6 bg-[#03C7EF] hover:bg-[#51b5c9] rounded flex justify-center items-center space-x-2',
                  loginMutation.isLoading &&
                     'cursor-not-allowed bg-[#316e9c] select-none'
               )}
               disabled={loginMutation.isLoading}
               onClick={onSubmit}
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
            <div className='mt-8 space-x-1 text-xs text-center'>
               <span className='text-[#7e7e7e]'>{t('dontaccount?')}</span>
               <span
                  className='text-[#4f4f4f] font-semibold hover:text-[#3c3c3c] cursor-pointer'
                  onClick={() =>
                     !loginMutation.isLoading && navigate('/signup')
                  }
               >
                  {t('action.signup', { ns: 'mutual' })}
               </span>
            </div>
         </div>
      </div>
   );
};

export default Login;
