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
import { ErrorResponse, IColor, ColorFormValues } from '@/types';
import { colorApi } from '@/api';
import { ColorPicker } from 'antd';

const formSchema = zod.object({
   name: zod.string().nonempty('Name is required'),
   vnName: zod.string().nonempty('Vietnamese name is required'),
   value: zod
      .string()
      .nonempty('Color name is required')
      .min(4)
      .max(9)
      .regex(/^#/, 'String must be a valid hex code'),
});

const initialForm = {
   name: '',
   vnName: '',
   value: '',
};

interface ColorFormProps {
   data: IColor | null;
   closeDrawer: () => void;
}

const ColorForm: FC<ColorFormProps> = ({ data, closeDrawer }) => {
   const queryClient = useQueryClient();
   const {
      register,
      handleSubmit,
      formState: { errors },
      setValue,
      watch,
      reset,
   } = useForm<ColorFormValues>({
      resolver: zodResolver(formSchema),
      mode: 'onChange',
   });

   const { t } = useTranslation(['dashboard', 'mutual']);
   const [color, setColor] = useState<string>('#ffffff');

   useEffect(() => {
      if (data) {
         reset(data);
      } else {
         reset(initialForm);
      }
   }, [data]);

   const createColorMutation = useMutation({
      mutationFn: (values: ColorFormValues) => {
         return colorApi.create(values);
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
      mutationFn: (values: ColorFormValues) => {
         return colorApi.update(data?._id!, values);
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
                     placeholder={t('color.colorName')}
                     isError={!!errors?.name}
                     {...register('name')}
                  />
                  <Error message={errors.name?.message} />
               </div>
               <div className='flex flex-col space-y-1'>
                  <label htmlFor='vnName'>
                     {t('label.vnName', { ns: 'mutual' })}
                  </label>
                  <Input
                     placeholder={t('label.vnName', { ns: 'mutual' })}
                     isError={!!errors?.vnName}
                     {...register('vnName')}
                  />
                  <Error message={errors.vnName?.message} />
               </div>
               <div className='flex flex-col space-y-2'>
                  <span>{t('label.hexCode', { ns: 'mutual' })}</span>
                  <span>
                     <ColorPicker
                        format='hex'
                        showText={(color) => (
                           <span className='dark:text-white'>
                              {color.toHexString()}
                           </span>
                        )}
                        value={watch('value')}
                        onChange={(_, hex) => setValue('value', hex)}
                        className='bg-transparent'
                     />
                  </span>
                  <Error message={errors.value?.message} />
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
