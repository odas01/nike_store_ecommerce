import { userApi } from '@/api';
import { useMutation, useQuery } from '@tanstack/react-query';
import React from 'react';
import * as z from 'zod';
import { useParams } from 'react-router-dom';
import authStore from '@/stores/authStore';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Col, Row } from 'antd';
import {
   Button,
   Error,
   Image,
   Input,
   LoadingOverlay,
   PageTitle,
   UploadButton,
} from '@/components';
import { useTranslation } from 'react-i18next';
import Title from '@/layouts/dashboard/components/Title';
import { notify } from '@/helpers';
import { UserFormUpdate } from '@/types';
const formSchema = z.object({
   name: z.string().nonempty('Your name is required'),
   phone: z.string().nonempty('Your phone is required'),
   address: z.string().nonempty('Your address is required'),
   avatar: z.string(),
});
type FormValues = z.infer<typeof formSchema>;

const Profile = () => {
   const { currentUser, updateInfo } = authStore();
   const { t, i18n } = useTranslation(['dashboard', 'mutual', 'home']);
   const isVnLang = i18n.language === 'vi';

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
         phone: currentUser?.phone,
         address: currentUser?.address,
         avatar: currentUser?.avatar?.url,
      },
      resolver: zodResolver(formSchema),
      mode: 'onChange',
   });

   const updateProfileMutation = useMutation({
      mutationFn: (values: UserFormUpdate) =>
         userApi.update(currentUser?._id!, values),
      onSuccess: ({ user, message }) => {
         updateInfo(user);
         notify('success', isVnLang ? message.vi : message.en);
         reset({
            name: user.name,
            phone: user.phone,
            address: user.address,
            avatar: user.avatar.url,
         });
      },

      onError: ({ message }) => {
         notify('error', isVnLang ? message.vi : message.en);
      },
   });
   const onSubmit = handleSubmit((values) => {
      updateProfileMutation.mutate({ ...values, role: currentUser?.role });
   });

   return (
      <>
         <PageTitle title='Colors' />
         <Title title={t('profile.title')} />

         {updateProfileMutation.isLoading && <LoadingOverlay />}
         <div className='flex flex-col px-6 pt-4 pb-8 mt-6 overflow-hidden rounded-md shadow-db dark:shadow-dark_db'>
            <Row gutter={60}>
               <Col span={12}>
                  <div className='space-y-2'>
                     <div className='flex flex-col space-y-1'>
                        <label htmlFor='name' className='text-13'>
                           {t('label.name', { ns: 'mutual' })}
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
                           readOnly
                           value={currentUser?.email}
                           className='rounded-md pointer-events-none'
                           placeholder='Your email'
                        />

                        <Error message='' />
                     </div>
                     <div className='flex flex-col space-y-1'>
                        <label htmlFor='phoneNumber' className='text-13'>
                           {t('label.phone', { ns: 'mutual' })}
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
                           {t('label.address', { ns: 'mutual' })}
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
                        {t('avatar', { ns: 'home' })}
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
               <Col span={12}>
                  <Button onClick={onSubmit} className='mt-8'>
                     {t('action.save', { ns: 'mutual' })}
                  </Button>
               </Col>
            </Row>
         </div>
      </>
   );
};

export default Profile;
