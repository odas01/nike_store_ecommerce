import { Button, Error, Input } from '@/components';
import * as zod from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { authApi } from '@/api';
import { ErrorResponse } from '@/types';
import { notify } from '@/helpers';
import DotLoader from 'react-spinners/DotLoader';
import { twMerge } from 'tailwind-merge';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';

const formSchema = zod.object({
   password: zod.string().nonempty('New password is required!'),
});

type ResetPasswordFormValue = zod.infer<typeof formSchema>;

const ResetPassword = () => {
   const navigate = useNavigate();
   const { id, token } = useParams();

   const { t, i18n } = useTranslation(['home', 'mutual']);
   const isVnLang = i18n.language === 'vi';

   const {
      register,
      handleSubmit,
      formState: { errors },
   } = useForm<ResetPasswordFormValue>({
      resolver: zodResolver(formSchema),
      mode: 'onChange',
   });

   const resetPasswordMutation = useMutation({
      mutationFn: (email: string) => authApi.resetPassword(email, id!, token!),
      onSuccess: async ({ message }) => {
         navigate('/login');
         notify('success', isVnLang ? message.vi : message.en);
      },

      onError: ({ message }) => {
         notify('error', isVnLang ? message.vi : message.en);
      },
   });

   const onSubmit = handleSubmit(async ({ password }) => {
      resetPasswordMutation.mutate(password);
   });

   return (
      <div className='space-y-10'>
         <h3 className='text-2xl text-center'>{t('auth.resetPass')}</h3>
         <div className='w-full py-8 bg-white rounded-md shadow-lg px-7'>
            <div className='space-y-3'>
               <div className='flex flex-col'>
                  <span className='text-13'>{t('newPass')}</span>
                  <Input
                     placeholder={t('enterNewPass')}
                     {...register('password')}
                     isError={!!errors.password}
                     disabled={resetPasswordMutation.isLoading}
                  />
                  <Error message={errors.password?.message} />
               </div>
            </div>
            <Button
               className={twMerge(
                  'w-full h-12 mt-6 bg-[#03C7EF] hover:bg-[#51b5c9] rounded flex justify-center items-center space-x-2',
                  resetPasswordMutation.isLoading &&
                     'cursor-not-allowed bg-[#316e9c] select-none'
               )}
               disabled={resetPasswordMutation.isLoading}
               onClick={onSubmit}
            >
               {resetPasswordMutation.isLoading && (
                  <DotLoader color='#fff' size={20} />
               )}
               <span>{t('action.send', { ns: 'mutual' })}</span>
            </Button>
         </div>
      </div>
   );
};

export default ResetPassword;
