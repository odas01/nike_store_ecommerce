import * as z from 'zod';
import { useForm } from 'react-hook-form';
import authStore from '@/stores/authStore';
import { zodResolver } from '@hookform/resolvers/zod';
import { Col, Row, Spin } from 'antd';
import { Button, Error, Image, Input, UploadButton } from '@/components';
import { ErrorResponse, UserFormUpdate } from '@/types';
import { useMutation } from '@tanstack/react-query';
import { userApi } from '@/api';
import { notify } from '@/helpers';
import { useTranslation } from 'react-i18next';

const formSchema = z.object({
   name: z.string().nonempty('Your name is required'),
   email: z.string().nonempty('Your email is required').email('Invalid email'),
   phone: z.string().nonempty('Your phone is required'),
   address: z.string().nonempty('Your address is required'),
   avatar: z.string(),
});
type FormValues = z.infer<typeof formSchema>;

const Profile = () => {
   const { currentUser, updateInfo } = authStore();
   const {
      register,
      handleSubmit,
      setValue,
      watch,
      reset,
      formState: { errors },
   } = useForm<FormValues>({
      defaultValues: {
         name: currentUser?.name,
         email: currentUser?.email,
         phone: currentUser?.phone,
         address: currentUser?.address,
         avatar: currentUser?.avatar?.url,
      },
      resolver: zodResolver(formSchema),
      mode: 'onChange',
   });

   const onSubmit = handleSubmit((values) => {
      updateProfileMutation.mutate({ ...values, role: currentUser?.role });
   });

   const updateProfileMutation = useMutation({
      mutationFn: (values: UserFormUpdate) =>
         userApi.update(currentUser?._id!, values),
      onSuccess: (data) => {
         updateInfo(data);
         notify('success', 'Update profile success');
         console.log(data);

         reset({
            name: data.name,
            email: data.email,
            phone: data.phone,
            address: data.address,
            avatar: data.avatar.url,
         });
      },
      onError: (err: ErrorResponse) => {
         notify('error', err.message);
      },
   });
   const { t } = useTranslation(['home', 'dashboard']);

   return (
      <div className='relative'>
         {updateProfileMutation.isLoading && (
            <div className='absolute top-0 right-0 z-10 flex items-center justify-center w-full h-full'>
               <Spin size='large' />
            </div>
         )}
         <h2 className='mb-4 text-xl font-semibold'>{t('profile')}</h2>

         <Row gutter={60}>
            <Col span={12}>
               <div className='space-y-2'>
                  <div className='flex flex-col space-y-1'>
                     <label htmlFor='name' className='text-13'>
                        {t('table.name', { ns: 'dashboard' })}
                     </label>
                     <Input
                        className='rounded-md'
                        placeholder='Your name'
                        {...register('name')}
                        isError={!!errors.name}
                     />
                     <Error message={errors.name?.message} />
                  </div>
                  <div className='flex flex-col space-y-1'>
                     <label htmlFor='email' className='text-13'>
                        Email
                     </label>

                     <Input
                        className='rounded-md'
                        placeholder='Your email'
                        {...register('email')}
                        isError={!!errors.email}
                     />
                     <Error message={errors.email?.message} />
                  </div>
                  <div className='flex flex-col space-y-1'>
                     <label htmlFor='phoneNumber' className='text-13'>
                        {t('table.phoneNumber', { ns: 'dashboard' })}
                     </label>

                     <Input
                        className='rounded-md'
                        placeholder='Your phone'
                        {...register('phone')}
                        isError={!!errors.phone}
                     />
                     <Error message={errors.phone?.message} />
                  </div>
                  <div className='flex flex-col space-y-1'>
                     <label htmlFor='address' className='text-13'>
                        {t('form.address', { ns: 'dashboard' })}
                     </label>

                     <Input
                        className='rounded-md'
                        placeholder='Your address'
                        {...register('address')}
                        isError={!!errors.address}
                     />
                     <Error message={errors.address?.message} />
                  </div>
               </div>
            </Col>
            <Col span={12}>
               <div className='flex flex-col space-y-1'>
                  <label htmlFor='name' className='text-13'>
                     {t('avatar')}
                  </label>
                  {watch('avatar') ? (
                     <Image
                        url={watch('avatar')}
                        onRemove={() => setValue('avatar', '')}
                        className='w-64'
                     />
                  ) : (
                     <UploadButton
                        setValue={(data) => setValue('avatar', data[0].url)}
                        className='w-64 h-64'
                     />
                  )}

                  <Error message={errors.avatar?.message} />
               </div>
            </Col>
         </Row>

         <Button onClick={onSubmit} className='mt-8'>
            {t('action.save', { ns: 'dashboard' })}
         </Button>
      </div>
   );
};

export default Profile;
