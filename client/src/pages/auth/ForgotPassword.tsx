import * as zod from 'zod';
import { twMerge } from 'tailwind-merge';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import DotLoader from 'react-spinners/DotLoader';
import { useMutation } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button, Error, Input } from '@/components';

import { authApi } from '@/api';
import { notify } from '@/helpers';

const formSchema = zod.object({
   email: zod.string().nonempty('Email is required!').email('Invalid email'),
});

type ForgotPasswordFormValue = zod.infer<typeof formSchema>;

const ForgotPassword = () => {
   const navigate = useNavigate();
   const { t, i18n } = useTranslation(['home', 'mutual']);
   const isVnLang = i18n.language === 'vi';
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
      onSuccess: async ({ message }) => {
         notify('success', isVnLang ? message.vi : message.en);
      },

      onError: ({ message }) => {
         notify('error', isVnLang ? message.vi : message.en);
      },
   });

   const onSubmit = handleSubmit(async (values) => {
      forgotPasswordMutation.mutate(values.email);
   });

   return (
      <div className='space-y-10'>
         <h3 className='text-2xl text-center'>{t('auth.forgotPass')}</h3>
         <div className='w-full py-8 bg-white rounded-md shadow-lg px-7'>
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
               <span>{t('action.send', { ns: 'mutual' })}</span>
            </Button>
            <div className='mt-8 text-xs text-center'>
               <span
                  className='text-[#4f4f4f] font-semibold hover:text-[#3c3c3c] cursor-pointer'
                  onClick={() =>
                     !forgotPasswordMutation.isLoading && navigate('/login')
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
