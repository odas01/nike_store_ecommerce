import * as zod from 'zod';
import { useForm } from 'react-hook-form';
import { ChromePicker } from 'react-color';
import { useTranslation } from 'react-i18next';
import { FC, useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { Dropdown, Error, Input } from '@/components';
import Footer from '@/components/drawer/Footer';
import Heading from '@/components/drawer/Header';

import { notify } from '@/helpers';
import { CouponFormUpload, ErrorResponse, IColor } from '@/types';
import { couponApi } from '@/api';
import { ICoupon } from '@/types';
import moment from 'moment';

const formSchema = zod.object({
   name: zod.string().nonempty('Color name is required'),
   code: zod.string().nonempty('Color name is required'),
   value: zod
      .number({
         invalid_type_error: 'Price is required',
      })
      .min(1)
      .max(99),
   type: zod.string().nonempty('Color name is required'),
   quantity: zod
      .number({
         invalid_type_error: 'Price is required',
      })
      .min(1)
      .max(100),
   expirationDate: zod
      .string()
      .regex(/^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/),
});

type CouponFormValues = zod.infer<typeof formSchema>;

const initialForm = {
   name: '',
   code: '',
   value: 0,
   type: '',
   quantity: 0,
   expirationDate: moment().format('YYYY-MM-DD'),
};

interface ColorFormProps {
   data: ICoupon | null;
   closeDrawer: () => void;
}

const ColorForm: FC<ColorFormProps> = ({ data, closeDrawer }) => {
   const queryClient = useQueryClient();
   const {
      register,
      handleSubmit,
      reset,
      setValue,
      formState: { errors },
   } = useForm<CouponFormValues>({
      resolver: zodResolver(formSchema),
      mode: 'onChange',
   });
   useEffect(() => {
      if (data) {
         reset({
            ...data,
            expirationDate: moment(data.expirationDate).format('YYYY-MM-DD'),
         });
      } else {
         reset(initialForm);
      }
   }, [data]);

   const { t } = useTranslation(['dashboard', 'mutual']);

   const createColorMutation = useMutation({
      mutationFn: (values: CouponFormUpload) => {
         return couponApi.create(values);
      },
      onSuccess: () => {
         notify('success', 'Created successfully');
         queryClient.invalidateQueries({ queryKey: ['colors'] });
      },
      onError: (error: ErrorResponse) => {
         notify('error', error.message);
      },
   });

   const editColorMutation = useMutation({
      mutationFn: (values: CouponFormUpload) => {
         return couponApi.update(data?._id!, values);
      },
      onSuccess: () => {
         notify('success', 'Update successfully');
         queryClient.invalidateQueries({ queryKey: ['colors'] });
      },
      onError: (error: ErrorResponse) => {
         notify('error', error.message);
      },
   });

   const onSubmit = handleSubmit(async (values) => {
      const newValues = {
         ...values,
         expirationDate: new Date(values.expirationDate),
      };

      if (data && data._id) {
         await editColorMutation.mutateAsync(newValues);
      } else {
         await createColorMutation.mutateAsync(newValues);
      }
      closeDrawer();
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
                     placeholder={t('coupon.name')}
                     isError={!!errors?.name}
                     {...register('name')}
                  />
                  <Error message={errors.name?.message} />
               </div>
               <div className='flex flex-col space-y-1'>
                  <label htmlFor='value'>{t('coupon.code')}</label>
                  <Input
                     placeholder={t('coupon.code')}
                     isError={!!errors?.code}
                     {...register('code')}
                  />
                  <Error message={errors.code?.message} />
               </div>
               <div className='flex flex-col space-y-1'>
                  <label htmlFor='value'>{t('coupon.type')}</label>
                  <Dropdown
                     items={[
                        {
                           label: (
                              <p
                                 className='px-3 py-2 capitalize'
                                 onClick={() => setValue('type', 'percent')}
                              >
                                 percent
                              </p>
                           ),
                        },
                        {
                           label: (
                              <p
                                 className='px-3 py-2 capitalize'
                                 onClick={() => setValue('type', 'vnd')}
                              >
                                 vnd
                              </p>
                           ),
                        },
                     ]}
                     children={
                        <Input
                           placeholder={t('placeholderForm.coupon.type')}
                           className='w-full capitalize appearance placeholder:normal-case focus:cursor-pointer'
                           {...register('type')}
                           isError={!!errors.type}
                           readOnly
                        />
                     }
                  />
                  <Error message={errors.type?.message} />
               </div>
               <div className='flex flex-col space-y-1'>
                  <label htmlFor='value'>
                     {t('label.value', { ns: 'mutual' })}
                  </label>
                  <Input
                     placeholder={t('label.value', { ns: 'mutual' })}
                     isError={!!errors?.value}
                     {...register('value', {
                        valueAsNumber: true,
                     })}
                  />
                  <Error message={errors.value?.message} />
               </div>
               <div className='flex flex-col space-y-1'>
                  <label htmlFor='value'>
                     {t('label.quantity', { ns: 'mutual' })}
                  </label>
                  <Input
                     placeholder={t('coupon.qty')}
                     isError={!!errors?.quantity}
                     {...register('quantity', {
                        valueAsNumber: true,
                     })}
                  />
                  <Error message={errors.quantity?.message} />
               </div>
               <div className='flex flex-col space-y-1'>
                  <label htmlFor='value'>
                     {t('label.expirationDate', { ns: 'mutual' })}
                  </label>
                  <Input
                     type='date'
                     autoComplete='off'
                     isError={!!errors?.expirationDate}
                     {...register('expirationDate')}
                  />
                  <Error message={errors.expirationDate?.message} />
               </div>
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

export default ColorForm;
