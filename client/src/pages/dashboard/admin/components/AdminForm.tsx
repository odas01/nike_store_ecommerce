import * as zod from 'zod';
import Switch from 'react-switch';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { FC, useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';

import Footer from '@/components/drawer/Footer';
import Heading from '@/components/drawer/Header';
import { Error, TextArea, Input } from '@/components';

import { IUser } from '@/types';
import { notify } from '@/helpers';
import { authApi, userApi } from '@/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const phoneRegex = new RegExp(
   /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/
);

const formSchema = zod.object({
   name: zod.string().nonempty('Admin name is required!'),
   email: zod.string().nonempty('Email is required!').email('Invalid email'),
   phone: zod
      .string()
      .nonempty('Phone number is required!')
      .min(9)
      .max(11)
      .regex(phoneRegex, 'Invalid phone number'),
   address: zod.string(),
});

type FormAdminValues = zod.infer<typeof formSchema>;

interface AdminFormProps {
   data: IUser | null;
   closeDrawer: () => void;
}

const initialForm = {
   name: '',
   email: '',
   phone: '',
   address: '',
};

const AdminForm: FC<AdminFormProps> = ({ data, closeDrawer }) => {
   const {
      register,
      handleSubmit,
      formState: { errors },
      reset,
   } = useForm<FormAdminValues>({
      resolver: zodResolver(formSchema),
      mode: 'onChange',
   });
   const [status, setStatus] = useState<string>(data ? data.status : 'active');

   const { t, i18n } = useTranslation('dashboard');
   const isVnLang = i18n.language === 'vi';
   const queryClient = useQueryClient();

   useEffect(() => {
      if (data) {
         setStatus(data.status);
         reset(data);
      } else {
         setStatus('active');
         reset(initialForm);
      }
   }, [data]);

   const onSubmit = handleSubmit(async (values) => {
      if (data) {
         await updateAdminMutation.mutate({ id: data._id, values });
      } else {
         await signUpMutation.mutate(values);
      }
      closeDrawer();
   });

   const signUpMutation = useMutation({
      mutationFn: (value: FormAdminValues) =>
         authApi.adminSignUp({
            ...value,
            password: 'admin',
         }),
      onSuccess: ({ message }) => {
         notify('success', isVnLang ? message.vi : message.en);
         queryClient.invalidateQueries({ queryKey: ['admins'] });
      },

      onError: ({ message }) => {
         notify('error', isVnLang ? message.vi : message.en);
      },
   });

   const updateAdminMutation = useMutation({
      mutationFn: ({ id, values }: { id: string; values: FormAdminValues }) =>
         userApi.update(id, {
            ...values,
            status,
         }),
      onSuccess: ({ message }) => {
         notify('success', isVnLang ? message.vi : message.en);
         queryClient.invalidateQueries({ queryKey: ['admins'] });
      },

      onError: ({ message }) => {
         notify('error', isVnLang ? message.vi : message.en);
      },
   });

   return (
      <div className='flex flex-col h-full'>
         <Heading>
            <h2 className='px-4 text-center'>
               {t(data ? 'action.edit' : 'action.create', { ns: 'mutual' })}
            </h2>
         </Heading>
         <div className='flex-1 dark:bg-[#111315] overflow-y-scroll'>
            <form className='flex flex-col p-6 space-y-2 font-medium [&>div>input]:text-sm'>
               <div className='flex flex-col space-y-1'>
                  <label htmlFor='name'>
                     {t('label.name', { ns: 'mutual' })}
                  </label>
                  <Input
                     placeholder={t('placeholderForm.admin.name')}
                     isError={!!errors?.name}
                     {...register('name')}
                  />
                  <Error message={errors.name?.message} />
               </div>
               <div className='flex flex-col space-y-1'>
                  <label htmlFor='email'>Email</label>
                  <Input
                     placeholder={t('placeholderForm.admin.email')}
                     isError={!!errors?.email}
                     {...register('email')}
                  />
                  <Error message={errors.email?.message} />
               </div>
               <div className='flex flex-col space-y-1'>
                  <label htmlFor='phone'>
                     {t('label.phone', { ns: 'mutual' })}
                  </label>
                  <Input
                     placeholder={t('placeholderForm.admin.phone')}
                     isError={!!errors?.phone}
                     {...register('phone')}
                  />
                  <Error message={errors.phone?.message} />
               </div>
               <div className='flex flex-col space-y-1'>
                  <label htmlFor='address'>
                     {t('label.address', { ns: 'mutual' })}
                  </label>
                  <TextArea
                     placeholder={t('placeholderForm.admin.address')}
                     isError={!!errors?.address}
                     {...register('address')}
                  />
                  <Error message={errors.address?.message} />
               </div>
               <Switch
                  offColor='#E53E3E'
                  onColor='#2F855A'
                  width={120}
                  checked={status === 'active'}
                  className='w-40'
                  checkedIcon={
                     <div className='flex items-center h-full pl-3 text-sm text-white w-28'>
                        {t('status.active', { ns: 'mutual' })}
                     </div>
                  }
                  uncheckedIcon={
                     <div className='flex items-center h-full -ml-8 text-sm text-white'>
                        {t('status.blocked', { ns: 'mutual' })}
                     </div>
                  }
                  onChange={(value) => setStatus(value ? 'active' : 'blocked')}
               />
               <span className='text-gray-400'>
                  {t('admin.passwordDefault')}: admin
               </span>
            </form>
         </div>

         <Footer>
            <div className='px-4 py-2 text-sm text-white flex justify-between space-x-3 [&>button]:flex-1 [&>button]:rounded-md [&>button]:px-4 [&>button]:py-2'>
               <button
                  className='duration-150 bg-gray-600 opacity-40 hover:opacity-30'
                  onClick={closeDrawer}
               >
                  {t('action.cancel', { ns: 'mutual' })}
               </button>
               <button
                  className='duration-150 bg-blue-500 hover:opacity-80'
                  onClick={onSubmit}
               >
                  {t(data ? 'action.edit' : 'action.create', { ns: 'mutual' })}
               </button>
            </div>
         </Footer>
      </div>
   );
};

export default AdminForm;
