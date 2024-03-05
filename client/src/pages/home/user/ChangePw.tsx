import { authApi } from '@/api';
import { Button, Error, Input, LoadingOverlay, PageTitle } from '@/components';
import { notify } from '@/helpers';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useTranslation } from 'react-i18next';

const formSchema = z
   .object({
      currentPass: z.string().nonempty('Your password is required'),
      newPass: z.string().nonempty('New password is required'),
      confirmPass: z.string().nonempty('Confirm password is required'),
   })
   .refine((data) => data.newPass === data.confirmPass, {
      message: 'Please enter the correct password',
      path: ['confirmPass'],
   });
type FormValues = z.infer<typeof formSchema>;

const ChangePw = () => {
   const { t, i18n } = useTranslation(['home', 'mutual']);
   const isVnLang = i18n.language === 'vi';

   const {
      register,
      handleSubmit,
      formState: { errors },
   } = useForm<FormValues>({
      resolver: zodResolver(formSchema),
      mode: 'onChange',
   });

   const onSubmit = handleSubmit((values) => {
      changePassMutation.mutate({
         currentPass: values.currentPass,
         newPass: values.newPass,
      });
   });

   const changePassMutation = useMutation({
      mutationFn: (values: any) => authApi.changePassword(values),
      onSuccess: ({ message }) => {
         notify('success', isVnLang ? message.vi : message.en);
      },

      onError: ({ message }) => {
         notify('error', isVnLang ? message.vi : message.en);
      },
   });

   return (
      <>
         <PageTitle title='Change password' />
         <div>
            {changePassMutation.isLoading && <LoadingOverlay />}
            <h2 className='pb-2 text-lg font-semibold text-center uppercase xl:normal-case md:pb-4 xl:text-start md:text-xl'>
               {t('changePass')}
            </h2>
            <div className='space-y-2'>
               <div className='flex flex-col space-y-1'>
                  <span className='text-13'>{t('currentPass')}</span>
                  <Input
                     type='password'
                     {...register('currentPass')}
                     isError={!!errors.currentPass}
                  />
                  <Error message={errors.currentPass?.message} />
               </div>
               <div className='flex flex-col space-y-1'>
                  <span className='text-13'>{t('newPass')}</span>
                  <Input
                     type='password'
                     {...register('newPass')}
                     isError={!!errors.newPass}
                  />
                  <Error message={errors.newPass?.message} />
               </div>
               <div className='flex flex-col space-y-1'>
                  <span className='text-13'>{t('confirmPass')}</span>
                  <Input
                     type='password'
                     {...register('confirmPass')}
                     isError={!!errors.confirmPass}
                  />
                  <Error message={errors.confirmPass?.message} />
               </div>
            </div>
            <Button onClick={onSubmit}>
               {t('action.save', { ns: 'mutual' })}
            </Button>
         </div>
      </>
   );
};

export default ChangePw;
