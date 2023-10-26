import * as zod from 'zod';
import Switch from 'react-switch';
import { twMerge } from 'tailwind-merge';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { FC, useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import Footer from '@/components/drawer/Footer';
import Heading from '@/components/drawer/Header';
import { Button, Error, Input, Select, Spinner } from '@/components';

import { notify } from '@/helpers';
import { store } from '@/constants';
import { categoryApi } from '@/api';
import { CagtegoryFormValue, ErrorResponse, ICategory } from '@/types';

const formSchema = zod.object({
   name: zod.string().nonempty('Name is required!'),
   vnName: zod.string().nonempty('Vietnamese name is required!'),
   store: zod.string().nonempty('Please chooes one store!'),
});

const initialForm = {
   name: '',
   vnName: '',
   store: '',
};

interface CategoryFormProps {
   data: ICategory | null;
   closeDrawer: () => void;
}

const CategoryForm: FC<CategoryFormProps> = ({ data, closeDrawer }) => {
   const {
      register,
      handleSubmit,
      formState: { errors },
      reset,
   } = useForm<CagtegoryFormValue>({
      resolver: zodResolver(formSchema),
      mode: 'onChange',
   });
   const [status, setStatus] = useState<string>(data ? data.status : 'show');

   const { t } = useTranslation('dashboard');

   useEffect(() => {
      if (data) {
         setStatus(data.status);
         reset(data);
      } else {
         setStatus('show');
         reset(initialForm);
      }
   }, [data]);

   const queryClient = useQueryClient();
   const getAllCategories = () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
   };

   const createCateMutation = useMutation({
      mutationFn: (values: CagtegoryFormValue) => {
         return categoryApi.create(values);
      },
      onSuccess: () => {
         notify('success', 'Created successfully');
      },
      onError: (error: ErrorResponse) => {
         notify('error', error.message);
      },
   });

   const editCateMutation = useMutation({
      mutationFn: (values: CagtegoryFormValue) => {
         return categoryApi.update(data?._id!, { ...values, status });
      },
      onSuccess: () => {
         notify('success', 'Edited successfully');
      },
      onError: (error: ErrorResponse) => {
         notify('error', error.message);
      },
   });

   const onSubmit = handleSubmit(async (values: CagtegoryFormValue) => {
      if (data) {
         await editCateMutation.mutateAsync(values);
      } else {
         await createCateMutation.mutateAsync(values);
      }
      closeDrawer();
      reset(initialForm);
      getAllCategories();
   });

   const isLoading = createCateMutation.isLoading || editCateMutation.isLoading;

   return (
      <div className='flex flex-col h-full'>
         <Heading>
            <h2 className='px-4 text-center'>
               {t(data ? 'action.edit' : 'action.create')}
            </h2>
         </Heading>
         <div className='flex-1 dark:bg-[#111315] overflow-y-scroll'>
            <form className='flex flex-col p-6 space-y-8 font-medium [&>div>input]:text-sm'>
               <div className='flex flex-col space-y-2'>
                  <label htmlFor='name'>{t('table.name')}</label>
                  <Input
                     placeholder='Admin name'
                     isError={!!errors?.name}
                     {...register('name')}
                  />
                  {errors?.name && <Error message={errors.name.message} />}
               </div>
               <div className='flex flex-col space-y-2'>
                  <label htmlFor='vnName'>Tên việt</label>
                  <Input
                     placeholder='Admin vnName'
                     isError={!!errors?.vnName}
                     {...register('vnName')}
                  />
                  {errors?.name && <Error message={errors.name.message} />}
               </div>
               <div className='flex flex-col space-y-2'>
                  <label htmlFor='store'>{t('table.store')}</label>
                  <Select
                     options={store.map((item) => ({
                        label: item,
                        value: item,
                     }))}
                     hiddenOption={{
                        label: '-- Choose one store -- ',
                        value: '',
                     }}
                     isError={!!errors?.store}
                     {...register('store')}
                  ></Select>
                  {errors?.store && <Error message={errors.store.message} />}
               </div>
               <Switch
                  offColor='#E53E3E'
                  onColor='#2F855A'
                  width={80}
                  checked={status === 'show'}
                  checkedIcon={
                     <div className='flex items-center h-full pl-3 text-sm text-white'>
                        {t('status.show')}
                     </div>
                  }
                  uncheckedIcon={
                     <div className='flex items-center h-full -ml-1 text-sm text-white'>
                        {t('status.hide')}
                     </div>
                  }
                  onChange={(value) => setStatus(value ? 'show' : 'hide')}
               />
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
               <Button
                  className={twMerge(
                     'py-2 bg-blue-600 hover:bg-blue-700 duration-150 space-x-2 flex justify-center items-center',
                     isLoading && '!bg-blue-700'
                  )}
                  disabled={isLoading}
                  onClick={onSubmit}
               >
                  {isLoading && <Spinner width={18} />}
                  <span>{t(data ? 'action.edit' : 'action.create')}</span>
               </Button>
            </div>
         </Footer>
      </div>
   );
};

export default CategoryForm;
