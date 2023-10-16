import * as zod from 'zod';
import { useForm } from 'react-hook-form';
import { ChromePicker } from 'react-color';
import { useTranslation } from 'react-i18next';
import { FC, useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { Error, Input } from '@/components';
import Footer from '@/components/drawer/Footer';
import Heading from '@/components/drawer/Header';

import { notify } from '@/helpers';
import { ErrorResponse, IColor, CouponForm as CouponFormValues } from '@/types';
import { couponApi } from '@/api';
import { ICoupon, CouponForm } from '@/types';

const formSchema = zod.object({
   name: zod.string().nonempty('Color name is required'),
   code: zod.string().nonempty('Color name is required'),
   value: zod.string().nonempty('Color name is required'),
   type: zod.string().nonempty('Color name is required'),
   quantity: zod.string().nonempty('Color name is required'),
   expirationDate: zod.coerce.date(),
});

interface ColorFormProps {
   data: ICoupon | null;
   closeDrawer: () => void;
}

const ColorForm: FC<ColorFormProps> = ({ data, closeDrawer }) => {
   const queryClient = useQueryClient();
   const {
      register,
      handleSubmit,
      formState: { errors },
      setValue,
      reset,
   } = useForm<CouponFormValues>({
      resolver: zodResolver(formSchema),
      mode: 'onChange',
   });

   const { t } = useTranslation('dashboard');
   const [color, setColor] = useState<string>('#ffffff');

   // useEffect(() => {
   //    if (data) {
   //       reset(data);
   //    } else {
   //       reset(initialForm);
   //    }
   // }, [data]);

   const createColorMutation = useMutation({
      mutationFn: (values: CouponFormValues) => {
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
      mutationFn: (values: CouponFormValues) => {
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
      if (data && data._id) {
         await editColorMutation.mutateAsync(values);
      } else {
         await createColorMutation.mutateAsync(values);
      }
      closeDrawer();
   });

   return (
      <div className='flex flex-col h-full'>
         <Heading>
            <h2 className='px-4 text-center'>
               {t(data ? 'action.edit' : 'action.create')}
            </h2>
         </Heading>
         <div className='flex-1 dark:bg-[#111315] overflow-y-scroll'>
            <form className='flex flex-col p-6 space-y-2 font-medium [&>div>input]:text-sm'>
               <div className='flex flex-col space-y-1'>
                  <label htmlFor='name'>Tên coupon</label>
                  <Input
                     placeholder='Color name'
                     isError={!!errors?.name}
                     {...register('name')}
                  />
                  <Error message={errors.name?.message} />
               </div>
               <div className='flex flex-col space-y-1'>
                  <label htmlFor='value'>Mã coupon</label>
                  <Input
                     placeholder='Please chooes color'
                     isError={!!errors?.code}
                     {...register('code')}
                  />
                  <Error message={errors.code?.message} />
               </div>
               <div className='flex flex-col space-y-1'>
                  <label htmlFor='value'>Loại giảm giá</label>
                  <Input
                     placeholder='Please chooes color'
                     isError={!!errors?.type}
                     {...register('type')}
                  />
                  <Error message={errors.type?.message} />
               </div>
               <div className='flex flex-col space-y-1'>
                  <label htmlFor='value'>Giá trị</label>
                  <Input
                     placeholder='Please chooes color'
                     isError={!!errors?.value}
                     {...register('value')}
                  />
                  <Error message={errors.value?.message} />
               </div>
               <div className='flex flex-col space-y-1'>
                  <label htmlFor='value'>Số lượng</label>
                  <Input
                     placeholder='Please chooes color'
                     isError={!!errors?.quantity}
                     {...register('quantity')}
                  />
                  <Error message={errors.quantity?.message} />
               </div>
               <div className='flex flex-col space-y-1'>
                  <label htmlFor='value'>Ngày bắt đầu</label>
                  <Input
                     type='date'
                     placeholder='Please chooes color'
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
                  {t('action.cancel')}
               </button>
               <button
                  className='duration-150 bg-blue-500 hover:opacity-80'
                  onClick={onSubmit}
               >
                  {t(data ? 'action.edit' : 'action.create')}
               </button>
            </div>
         </Footer>
      </div>
   );
};

export default ColorForm;
