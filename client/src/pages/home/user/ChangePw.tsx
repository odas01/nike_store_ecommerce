import { authApi } from '@/api';
import { Button, Error, Input } from '@/components';
import { notify } from '@/helpers';
import { ErrorResponse } from '@/types';
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
   const { t } = useTranslation(['home', 'dashboard']);
   const {
      register,
      handleSubmit,
      formState: { errors },
   } = useForm<FormValues>({
      resolver: zodResolver(formSchema),
      mode: 'onChange',
   });

   const onSubmit = handleSubmit((values) => {
      console.log(values);

      updateProfileMutation.mutate({
         currentPass: values.currentPass,
         newPass: values.newPass,
      });
   });

   const updateProfileMutation = useMutation({
      mutationFn: (values: any) => authApi.changePassword(values),
      onSuccess: () => {
         notify('success', 'Change password success');
      },
      onError: (err: ErrorResponse) => {
         notify('error', err.message);
      },
   });

   return (
      <div>
         <h2 className='mb-4 text-xl font-semibold'>{t('changePass')}</h2>
         <div className='space-y-2'>
            <div className='flex flex-col space-y-1'>
               <span className='text-13'>{t('currentPass')}</span>
               <Input
                  className='rounded-md'
                  {...register('currentPass')}
                  isError={!!errors.currentPass}
               />
               <Error message={errors.currentPass?.message} />
            </div>
            <div className='flex flex-col space-y-1'>
               <span className='text-13'>{t('newPass')}</span>
               <Input
                  className='rounded-md'
                  {...register('newPass')}
                  isError={!!errors.newPass}
               />
               <Error message={errors.newPass?.message} />
            </div>
            <div className='flex flex-col space-y-1'>
               <span className='text-13'>{t('confirmPass')}</span>
               <Input
                  className='rounded-md'
                  {...register('confirmPass')}
                  isError={!!errors.confirmPass}
               />
               <Error message={errors.confirmPass?.message} />
            </div>
         </div>
         <Button onClick={onSubmit}>
            {t('action.save', { ns: 'dashboard' })}
         </Button>
      </div>
   );
};

export default ChangePw;
