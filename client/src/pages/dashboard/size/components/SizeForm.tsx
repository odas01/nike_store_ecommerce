import * as zod from 'zod';
import { FC, useEffect } from 'react';
import { twMerge } from 'tailwind-merge';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import Footer from '@/components/drawer/Footer';
import Heading from '@/components/drawer/Header';
import { Button, Error, Spinner, Input, Dropdown } from '@/components';

import { sizeApi } from '@/api';
import { notify } from '@/helpers';
import { store } from '@/constants';
import { ErrorResponse, ISize, SizeFormValues } from '@/types';

const formSchema = zod.object({
   name: zod.string().nonempty('Size name is required!'),
   store: zod.string().nonempty('Please chooes one store!'),
});

const initialForm = {
   name: '',
   store: '',
};

interface SizeFormProps {
   data: ISize | null;
   closeDrawer: () => void;
}

const SizeForm: FC<SizeFormProps> = ({ data, closeDrawer }) => {
   const {
      register,
      handleSubmit,
      formState: { errors },
      reset,
      setValue,
   } = useForm<SizeFormValues>({
      resolver: zodResolver(formSchema),
      mode: 'onChange',
   });
   const queryClient = useQueryClient();
   const { t, i18n } = useTranslation(['dashboard', 'mutual']);
   const isVnLang = i18n.language === 'vi';
   useEffect(() => {
      if (data) {
         reset(data);
      } else {
         reset(initialForm);
      }
   }, [data]);

   const createSizeMutation = useMutation({
      mutationFn: (values: SizeFormValues) => {
         return sizeApi.create(values);
      },
      onSuccess: ({ message }) => {
         notify('success', isVnLang ? message.vi : message.en);
         queryClient.invalidateQueries({ queryKey: ['sizes'] });
      },

      onError: ({ message }) => {
         notify('error', isVnLang ? message.vi : message.en);
      },
   });

   const editSizeMutation = useMutation({
      mutationFn: (values: SizeFormValues) => {
         return sizeApi.update(data?._id!, values);
      },
      onSuccess: () => {
         notify('success', t('notify.updateSuccess', { ns: 'mutual' }));
         queryClient.invalidateQueries({ queryKey: ['sizes'] });
      },

      onError: ({ message }) => {
         notify('error', isVnLang ? message.vi : message.en);
      },
   });

   const onSubmit = handleSubmit(async (values) => {
      if (data && data._id) {
         await editSizeMutation.mutateAsync(values);
      } else {
         await createSizeMutation.mutateAsync(values);
      }
      reset(initialForm);
      closeDrawer();
   });

   const isLoading = createSizeMutation.isLoading || editSizeMutation.isLoading;

   return (
      <div className='flex flex-col h-full'>
         <Heading>
            <h2 className='relative px-4 text-center'>
               {t(data ? 'action.edit' : 'action.create', { ns: 'mutual' })}
            </h2>
         </Heading>
         <div className='flex-1 dark:bg-[#111315] overflow-y-scroll'>
            <form className='flex flex-col p-6 space-y-8 font-medium [&>div>input]:text-sm'>
               <div className='flex flex-col space-y-2'>
                  <label htmlFor='name'>
                     {t('label.name', { ns: 'mutual' })}
                  </label>
                  <Input
                     placeholder={t('size.sizeName')}
                     isError={!!errors?.name}
                     {...register('name')}
                  />
                  {errors?.name && <Error message={errors.name.message} />}
               </div>
               <div className='flex flex-col space-y-2'>
                  <label htmlFor='store'>
                     {t('label.store', { ns: 'mutual' })}
                  </label>
                  <Dropdown
                     items={store.map((item) => ({
                        label: (
                           <p
                              className='px-3 py-2 capitalize'
                              onClick={() => setValue('store', item)}
                           >
                              {t(`store.${item}`, { ns: 'mutual' })}
                           </p>
                        ),
                     }))}
                     children={
                        <Input
                           placeholder={t('size.chooesStore')}
                           className='w-full capitalize appearance placeholder:normal-case focus:cursor-pointer'
                           {...register('store')}
                           isError={!!errors.store}
                           readOnly
                        />
                     }
                  />
                  {errors?.store && <Error message={errors.store.message} />}
               </div>
            </form>
         </div>

         <Footer>
            <div className='px-4 py-2 text-sm text-white flex justify-between space-x-3 [&>button]:flex-1'>
               <Button
                  className='duration-150 bg-gray-600 opacity-40 hover:bg-gray-700'
                  onClick={closeDrawer}
               >
                  {t('action.cancel', {
                     ns: 'mutual',
                  })}
               </Button>
               <Button
                  className={twMerge(
                     'py-2 bg-blue-600 hover:bg-blue-700 duration-150 space-x-2 flex justify-center items-center',
                     isLoading && '!bg-blue-700'
                  )}
                  disabled={isLoading}
                  onClick={onSubmit}
               >
                  {isLoading && <Spinner width={18} />}
                  <span>
                     {t(data ? 'action.edit' : 'action.create', {
                        ns: 'mutual',
                     })}
                  </span>
               </Button>
            </div>
         </Footer>
      </div>
   );
};

export default SizeForm;
