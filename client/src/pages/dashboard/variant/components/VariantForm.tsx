import * as z from 'zod';
import { Col, Row, Spin } from 'antd';

import React, { FC, SetStateAction, createContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQueries, useQueryClient } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';

import {
   Input,
   Error,
   Button,
   Dropdown,
   Skeleton,
   UploadButton,
} from '@/components';

import { ErrorResponse, IColor, IProduct, VariantForm } from '@/types';
import { colorApi, productApi, sizeApi, variantApi } from '@/api';
import SizeArrayField from './SizeArrayField';
import { Image, UploadImages } from './ImageField';
import { AiTwotoneEdit } from 'react-icons/ai';
import { twMerge } from 'tailwind-merge';
import { notify } from '@/helpers';
import { BsTrash } from 'react-icons/bs';

interface VariantFormContext {
   colorList: IColor[];
   setImagesDelete: React.Dispatch<SetStateAction<string[]>>;
}

export const VariantFormContext = createContext<VariantFormContext>(
   {} as VariantFormContext
);

export const variantSchema = z.object({
   color: z.string().nonempty('Please chooes color or delete color'),
   sizes: z
      .object({
         size: z.string().nonempty('Please chooes size or delete size'),
         stock: z
            .number({
               invalid_type_error: 'Stock is required',
            })
            .min(0, 'Minimum stock quantity is 10'),
      })
      .array(),
   thumbnail: z.object({
      public_id: z.string(),
      url: z.string().nonempty('Image is required'),
   }),
   images: z
      .object({
         public_id: z.string(),
         url: z.string().nonempty('Image is required'),
      })
      .array(),
});

interface VariantFormProps {
   product: IProduct;
   value: VariantForm;
   isDelete?: boolean;
}

const VariantForm: FC<VariantFormProps> = ({
   product,
   value,
   isDelete = true,
}) => {
   const [isEdit, setIsEdit] = useState<boolean>(!value?._id);
   const [imagesDelete, setImagesDelete] = useState<string[]>([]);

   const { slug } = useParams();
   const queryClient = useQueryClient();
   const { t } = useTranslation(['dashboard', 'mutual']);

   const props = useForm<VariantForm>({
      defaultValues: value,
      resolver: zodResolver(variantSchema),
      mode: 'onChange',
   });

   const {
      setValue,
      register,
      handleSubmit,
      reset,
      watch,
      formState: { errors },
   } = props;

   const thumbnail = watch('thumbnail');

   const results = useQueries({
      queries: [
         {
            queryKey: ['colors'],
            queryFn: () => colorApi.getAll(),
         },
         { queryKey: ['sizes'], queryFn: () => sizeApi.getAll() },
      ],
   });

   const [
      { data: colorData, isLoading: loading1 },
      { data: sizeData, isLoading: loading2 },
   ] = results;

   const createProductMutation = useMutation({
      mutationFn: (values: VariantForm) => {
         return variantApi.create(values);
      },
      onSuccess: () => {
         reset(value);
         notify('success', 'Created product successfully');
      },
      onError: (error: ErrorResponse) => {
         notify('error', error.message);
      },
   });

   const updateVariantMutation = useMutation({
      mutationFn: (values: VariantForm) =>
         variantApi.update(value._id!, values),
      onSuccess: () => {
         queryClient.invalidateQueries({
            queryKey: ['product', slug],
         });
         notify('success', 'Update successful');
      },
      onError: (err: ErrorResponse) => {
         notify('error', err.message);
      },
   });

   const deleteVariantMutation = useMutation({
      mutationFn: () => variantApi.delete(value._id!),
      onSuccess: async () => {
         notify('success', 'Delete successful');
         await deleteImgs.mutateAsync([
            value.thumbnail.public_id,
            ...value.images.map((item) => item.public_id),
         ]);
         queryClient.invalidateQueries({
            queryKey: ['product', slug],
         });
      },
      onError: (err: ErrorResponse) => {
         notify('error', err.message);
      },
   });

   const deleteImgs = useMutation({
      mutationFn: (images: string[]) => productApi.deleteImageList(images),
   });

   const onSubmit = handleSubmit(async (values) => {
      const { color, ...rest } = values;

      // color
      const color_id = colorData?.colors.find((item) => item.name === color)
         ?._id as string;

      const newValue = {
         ...rest,
         product_id: product?._id!,
         color: color_id,
      };

      if (value._id) {
         await updateVariantMutation.mutateAsync(newValue);
         if (imagesDelete.length > 0) {
            deleteImgs.mutate(imagesDelete);
         }
      } else {
         createProductMutation.mutate(newValue);
      }
   });

   if (loading1 || loading2) {
      return <Skeleton />;
   }

   return (
      colorData &&
      product &&
      sizeData && (
         <VariantFormContext.Provider
            value={{
               setImagesDelete,
               colorList: colorData?.colors,
            }}
         >
            <FormProvider {...props}>
               <div className='relative px-6 pt-4 pb-8 overflow-hidden rounded-md shadow-db dark:shadow-dark_db'>
                  <Row
                     gutter={[36, 8]}
                     className={twMerge(
                        !isEdit && 'pointer-events-none opacity-70 duration-150'
                     )}
                  >
                     {/* STORE */}
                     <Col span={12}>
                        <div className='relative flex flex-col space-y-1 w-[94%]'>
                           <label htmlFor='store' className='font-medium'>
                              {t('color.aside')}
                           </label>
                           <Dropdown
                              items={colorData.colors.map((color) => ({
                                 label: (
                                    <div
                                       className='flex items-center px-3 py-2 pl-2 capitalize'
                                       onClick={() =>
                                          setValue('color', color.name)
                                       }
                                    >
                                       <div
                                          className='w-3 mr-2 rounded-full aspect-square'
                                          style={{
                                             backgroundColor: color.value,
                                          }}
                                       />
                                       {color.name}
                                    </div>
                                 ),
                              }))}
                              children={
                                 <div className='relative w-full'>
                                    <Input
                                       placeholder='Choose a store'
                                       className='w-full !pl-9 capitalize appearance placeholder:normal-case focus:cursor-pointer'
                                       {...register('color')}
                                       isError={!!errors.color}
                                       readOnly
                                    />
                                    <div
                                       className='absolute w-4 -translate-y-1/2 bg-red-400 rounded-full top-1/2 left-3 aspect-square'
                                       style={{
                                          backgroundColor:
                                             colorData.colors.find(
                                                (item) =>
                                                   item.name === watch('color')
                                             )?.value,
                                       }}
                                    />
                                 </div>
                              }
                           />
                           <Error message={errors.color?.message} />
                        </div>
                        <SizeArrayField
                           sizeList={sizeData.sizes}
                           store={product.category.store}
                        />
                     </Col>
                     {/* PRICES */}

                     <Col span={12}>
                        <div className='flex flex-col mb-4 space-y-1'>
                           <label htmlFor='desc' className='font-medium'>
                              Thumbnail
                           </label>

                           {thumbnail.url ? (
                              <Image
                                 url={thumbnail.url}
                                 onRemove={() =>
                                    setValue('thumbnail', {
                                       public_id: '',
                                       url: '',
                                    })
                                 }
                              />
                           ) : (
                              <UploadButton
                                 setValue={(data) =>
                                    setValue('thumbnail', data[0])
                                 }
                              />
                           )}
                        </div>
                        <div className='flex flex-col space-y-1'>
                           <label htmlFor='desc' className='font-medium'>
                              Images
                           </label>
                           <UploadImages />
                        </div>
                     </Col>
                  </Row>

                  <div className='absolute top-4 right-4'>
                     {!isEdit ? (
                        <div className='flex items-center space-x-3'>
                           <div
                              className='p-1.5 bg-white rounded cursor-pointer'
                              title={t('action.edit', { ns: 'mutual' })}
                              onClick={() => setIsEdit(true)}
                           >
                              <AiTwotoneEdit size={16} color='#000' />
                           </div>
                           {isDelete && (
                              <div
                                 title={t('action.delete', { ns: 'mutual' })}
                                 className='p-1.5 bg-red-500 rounded cursor-pointer'
                                 onClick={() => deleteVariantMutation.mutate()}
                              >
                                 <BsTrash size={16} />
                              </div>
                           )}
                        </div>
                     ) : (
                        <div className='flex justify-start space-x-2'>
                           {!!value._id && (
                              <Button
                                 onClick={() => setIsEdit(false)}
                                 className={twMerge(
                                    ' h-10 space-x-2 border border-gray-700 opacity-75 bg-transparent hover:bg-transparent',
                                    (createProductMutation.isLoading ||
                                       updateVariantMutation.isLoading) &&
                                       'pointer-events-none cursor-default'
                                 )}
                              >
                                 Cancel
                              </Button>
                           )}
                           <Button
                              onClick={onSubmit}
                              className={twMerge(
                                 'w-32 h-10 space-x-2 bg-blue-800 hover:bg-blue-900',
                                 (createProductMutation.isLoading ||
                                    updateVariantMutation.isLoading) &&
                                    'bg-blue-900 pointer-events-none cursor-default'
                              )}
                           >
                              {(createProductMutation.isLoading ||
                                 updateVariantMutation.isLoading) && (
                                 <Spin size='small' />
                              )}
                              <span>Save</span>
                           </Button>
                        </div>
                     )}
                  </div>
                  {deleteVariantMutation.isLoading && (
                     <div className='absolute top-0 right-0 w-full h-full bg-[rgba(0,0,0,0.05)] flex justify-center items-center'>
                        <Spin size='large' />
                     </div>
                  )}
               </div>
            </FormProvider>
         </VariantFormContext.Provider>
      )
   );
};

export default VariantForm;
