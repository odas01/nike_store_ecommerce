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
});

type ForgotPasswordFormValue = zod.infer<typeof formSchema>;

const ForgotPassword = () => {
   const { t } = useTranslation(['home', 'mutual']);
   const navigate = useNavigate();

   const {
      register,
      handleSubmit,
      formState: { errors },
   } = useForm<ForgotPasswordFormValue>({
      resolver: zodResolver(formSchema),
      mode: 'onChange',
   });

   const forgotPasswordMutation = useMutation({
      mutationFn: (email: string) => authApi.forgotPassword(email),
      onSuccess: async () => {
         //    saveToken(token);
         //    setCurrentUser(user);
         //    getCart();
         //    notify('success', `Welcome ${user.name} to Nike Store`);
         //    navigate('/');
      },

      onError: (error: ErrorResponse) => {
         notify('error', error.message);
      },
   });

   const onSubmit = handleSubmit(async (values) => {
      forgotPasswordMutation.mutate(values.email);
   });

   return (
      <div className='space-y-10'>
         <h3 className='text-2xl text-center'>Forgot password</h3>
         <div className='w-full rounded-md shadow-lg px-7 py-8 bg-white'>
            <div className='space-y-3'>
               <div className='flex flex-col'>
                  <span className='text-13'>Email</span>
                  <Input
                     placeholder={t('placeHolder.typeEmail')}
                     {...register('email')}
                     isError={!!errors.email}
                     disabled={forgotPasswordMutation.isLoading}
                  />
                  <Error message={errors.email?.message} />
               </div>
            </div>
            <Button
               className={twMerge(
                  'w-full h-12 mt-6 bg-[#03C7EF] hover:bg-[#51b5c9] rounded flex justify-center items-center space-x-2',
                  forgotPasswordMutation.isLoading &&
                     'cursor-not-allowed bg-[#316e9c] select-none'
               )}
               disabled={forgotPasswordMutation.isLoading}
               onClick={onSubmit}
            >
               {forgotPasswordMutation.isLoading && (
                  <DotLoader color='#fff' size={20} />
               )}
               <span>Send</span>
            </Button>
            <div className='mt-8 text-xs text-center'>
               <span
                  className='text-[#4f4f4f] font-semibold hover:text-[#3c3c3c] cursor-pointer'
                  onClick={() =>
                     !forgotPasswordMutation.isLoading && navigate('/signup')
                  }
               >
                  {t('action.login', { ns: 'mutual' })}
               </span>
            </div>
         </div>
      </div>
   );
};

export default ForgotPassword;
