import * as z from 'zod';
import { Col, Row } from 'antd';
import React, { FC, SetStateAction, createContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQueries } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm } from 'react-hook-form';

import { UploadImages, Image } from './ImageField';
import SizeArrayField from './SizeArrayField';
import {
   Input,
   Error,
   Button,
   TextArea,
   Dropdown,
   Skeleton,
   UploadButton,
} from '@/components';

import { genders } from '@/constants';
import { IColor, ProductFormValue } from '@/types';
import { categoryApi, colorApi, sizeApi } from '@/api';

interface ProductFormContext {
   colorList: IColor[];
   setImagesDelete: React.Dispatch<SetStateAction<string[]>>;
}

export const ProductFormContext = createContext<ProductFormContext>(
   {} as ProductFormContext
);

export const productSchema = z.object({
   name: z.string().nonempty('Name is required'),
   discount: z.number(),
   prices: z.object({
      originalPrice: z
         .number({
            invalid_type_error: 'Price is required',
         })
         .min(1, 'Minimum price is 1vnd'),
      price: z.number(),
   }),
   store: z.string().nonempty('Please chooes category'),
   category: z.string().nonempty('Please chooes category'),
   genders: z.string().array().min(1, 'Please chooes at least 1 gender'),
   desc: z.string().nonempty('Description is required'),
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

interface CreateFormProps {
   value: ProductFormValue;
   submit: (value: ProductFormValue) => void;
   deleteImages?: (images: string[]) => void;
}

const CreateForm: FC<CreateFormProps> = ({ value, submit, deleteImages }) => {
   const [imagesDelete, setImagesDelete] = useState<string[]>([]);

   const { t, i18n } = useTranslation(['dashboard', 'mutual']);

   const isVnLang = i18n.language === 'vi';

   const props = useForm<ProductFormValue>({
      defaultValues: value,
      resolver: zodResolver(productSchema),
      mode: 'onChange',
   });

   const {
      setValue,
      register,
      getValues,
      clearErrors,
      handleSubmit,
      watch,
      formState: { errors },
   } = props;
   const results = useQueries({
      queries: [
         {
            queryKey: ['variants'],
            queryFn: () => colorApi.getAll(),
         },
         {
            queryKey: ['allSize'],
            queryFn: () =>
               sizeApi.getAll({
                  skip: 0,
                  limit: 100,
                  createdAt: -1,
               }),
         },
         {
            queryKey: ['allCate', 0, 100],
            queryFn: () =>
               categoryApi.getAll({
                  skip: 0,
                  limit: 100,
               }),
         },
      ],
   });

   const [
      { data: colorData, isLoading: loading1 },
      { data: sizeData, isLoading: loading2 },
      { data: categoryData, isLoading: loading3 },
   ] = results;

   const onSubmit = handleSubmit(async (values) => {
      const { category, color, prices, discount, ...value } = values;

      // category
      const category_id = categoryData?.categories.find(
         (item) => item.name === category
      )?._id as string;

      // color
      const color_id = colorData?.colors.find((item) => item.name === color)
         ?._id as string;

      // prices

      prices.price = Number(
         prices.originalPrice - (prices.originalPrice * discount) / 100
      );

      const newValue = {
         ...value,
         prices,
         discount,
         color: color_id,
         category: category_id,
      };

      submit(newValue);
      if (imagesDelete.length > 0 && deleteImages) {
         deleteImages(imagesDelete);
      }
   });

   if (loading1 || loading2 || loading3) {
      return <Skeleton />;
   }

   const thumbnail = watch('thumbnail');

   return (
      colorData?.colors &&
      sizeData?.sizes &&
      categoryData?.categories && (
         <ProductFormContext.Provider
            value={{ colorList: colorData?.colors, setImagesDelete }}
         >
            <FormProvider {...props}>
               <div className='p-4 rounded-md shadow-db dark:shadow-dark_db'>
                  <Row gutter={[36, 8]}>
                     {/* NAME */}
                     <Col span={24} className='space-y-8' order={1}>
                        <div className='flex flex-col space-y-1'>
                           <label htmlFor='name' className='font-medium'>
                              {t('label.name', { ns: 'mutual' })}

                              <span className='ml-0.5 text-red-500 '>*</span>
                           </label>
                           <Input
                              placeholder={t('placeholderForm.product.name')}
                              {...register('name')}
                              isError={!!errors.name}
                           />
                           <Error message={errors.name?.message} />
                        </div>
                     </Col>

                     {/* STORE */}
                     <Col span={12} order={4}>
                        <div className='flex flex-col space-y-1'>
                           <label htmlFor='store' className='font-medium'>
                              {t('label.color', { ns: 'mutual' })}

                              <span className='ml-0.5 text-red-500 '>*</span>
                           </label>
                           <Dropdown
                              items={colorData.colors.map((color) => ({
                                 label: (
                                    <div
                                       className='flex items-center px-3 py-2 capitalize'
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
                                 <Input
                                    placeholder={t(
                                       'placeholderForm.product.color'
                                    )}
                                    className='w-full capitalize appearance placeholder:normal-case focus:cursor-pointer'
                                    {...register('color')}
                                    isError={!!errors.color}
                                    readOnly
                                 />
                              }
                           />
                           <Error message={errors.color?.message} />
                        </div>
                     </Col>
                     {/* STORE */}
                     <Col span={12} order={4}>
                        <div className='flex flex-col space-y-1'>
                           <label htmlFor='store' className='font-medium'>
                              {t('label.store', { ns: 'mutual' })}

                              <span className='ml-0.5 text-red-500 '>*</span>
                           </label>
                           <Dropdown
                              items={[
                                 {
                                    label: (
                                       <p
                                          className='px-3 py-2 capitalize'
                                          onClick={() => {
                                             setValue('store', 'shoes');
                                             setValue('category', '');

                                             clearErrors('store');
                                          }}
                                       >
                                          Shoes
                                       </p>
                                    ),
                                 },
                                 {
                                    label: (
                                       <p
                                          className='px-3 py-2 capitalize'
                                          onClick={() => {
                                             setValue('store', 'clothing');
                                             setValue('category', '');

                                             clearErrors('store');
                                          }}
                                       >
                                          Clothing
                                       </p>
                                    ),
                                 },
                                 {
                                    label: (
                                       <p
                                          className='px-3 py-2 capitalize'
                                          onClick={() => {
                                             setValue('store', 'accessories');
                                             setValue('category', '');

                                             clearErrors('store');
                                          }}
                                       >
                                          Accessories
                                       </p>
                                    ),
                                 },
                              ]}
                              children={
                                 <Input
                                    placeholder={t(
                                       'placeholderForm.product.store'
                                    )}
                                    className='w-full capitalize appearance placeholder:normal-case focus:cursor-pointer'
                                    {...register('store')}
                                    isError={!!errors.store}
                                    readOnly
                                 />
                              }
                           />
                           <Error message={errors.store?.message} />
                        </div>
                     </Col>

                     {/* CATEGORY */}
                     <Col span={12} order={6}>
                        <div className='flex flex-col space-y-1'>
                           <label htmlFor='category' className='font-medium'>
                              {t('label.category', { ns: 'mutual' })}

                              <span className='ml-0.5 text-red-500 '>*</span>
                           </label>
                           <Dropdown
                              items={categoryData.categories
                                 .filter((item) => {
                                    return item.store === getValues('store');
                                 })
                                 .map((item) => ({
                                    label: (
                                       <p
                                          className='px-3 py-2 capitalize'
                                          onClick={() => {
                                             setValue('category', item.name);
                                             clearErrors('category');
                                          }}
                                       >
                                          {item.name}
                                       </p>
                                    ),
                                 }))}
                              children={
                                 <Input
                                    placeholder={t(
                                       'placeholderForm.product.category'
                                    )}
                                    className='w-full capitalize appearance placeholder:normal-case focus:cursor-pointer'
                                    {...register('category')}
                                    isError={!!errors.category}
                                    readOnly
                                 />
                              }
                           />
                           <Error message={errors.category?.message} />
                        </div>
                     </Col>

                     {/* GENDERS */}
                     <Col span={12} order={4}>
                        <div className='flex flex-col space-y-1'>
                           <label htmlFor='genders' className='font-medium'>
                              {t('label.gender', { ns: 'mutual' })}

                              <span className='ml-0.5 text-red-500 '>*</span>
                           </label>
                           <Dropdown
                              items={genders.map((gender) => ({
                                 label: (
                                    <div
                                       className='px-3 py-2 capitalize'
                                       onClick={() => {
                                          setValue('genders', [gender]);
                                          clearErrors('genders');
                                       }}
                                    >
                                       {gender}
                                    </div>
                                 ),
                              }))}
                              children={
                                 <Input
                                    placeholder={t(
                                       'placeholderForm.product.gender'
                                    )}
                                    className='w-full capitalize appearance placeholder:normal-case focus:cursor-pointer'
                                    {...register('genders')}
                                    isError={!!errors.genders}
                                    readOnly
                                 />
                              }
                           />
                           <Error message={errors.genders?.message} />
                        </div>
                     </Col>

                     {/* PRICES */}
                     <Col span={12} order={2}>
                        <div className='relative flex flex-col space-y-1'>
                           <label htmlFor='price' className='font-medium'>
                              {t('label.price', { ns: 'mutual' })}

                              <span className='ml-0.5 text-red-500 '>*</span>
                           </label>
                           <div className='flex'>
                              <p className=' border border-r-0 w-8 flex rounded-l justify-center items-center border-gray-400 dark:border-[#3f4244]'>
                                 đ
                              </p>
                              <Input
                                 type='number'
                                 placeholder={t(
                                    'placeholderForm.product.price'
                                 )}
                                 {...register('prices.originalPrice', {
                                    valueAsNumber: true,
                                 })}
                                 className='flex-1 rounded-tl-none rounded-bl-none'
                                 isError={!!errors.prices?.originalPrice}
                              />
                           </div>
                           <Error
                              message={errors.prices?.originalPrice?.message}
                           />
                        </div>
                     </Col>

                     {/* DISCOUNT */}
                     <Col span={12} order={3}>
                        <div className='relative flex flex-col space-y-1'>
                           <label htmlFor='price' className='font-medium'>
                              {t('label.discount', { ns: 'mutual' })}

                              <span className='ml-0.5 text-red-500 '>*</span>
                           </label>
                           <div className='flex'>
                              <p className=' border border-r-0 w-8 flex justify-center rounded-l items-center border-gray-400 dark:border-[#3f4244]'>
                                 %
                              </p>
                              <Input
                                 type='number'
                                 placeholder={t(
                                    'placeholderForm.product.discount'
                                 )}
                                 {...register('discount', {
                                    valueAsNumber: true,
                                 })}
                                 className='flex-1 rounded-tl-none rounded-bl-none'
                                 isError={!!errors.discount}
                              />
                           </div>
                           <Error message={errors.discount?.message} />
                        </div>
                     </Col>

                     <Col span={24} order={6}>
                        <div className='flex flex-col space-y-1'>
                           <label htmlFor='desc' className='font-medium'>
                              {t('label.desc', { ns: 'mutual' })}

                              <span className='ml-0.5 text-red-500 '>*</span>
                           </label>
                           <TextArea {...register('desc')} rows={4} />
                           <Error message={errors.desc?.message} />
                        </div>
                     </Col>

                     <Col span={12} order={6}>
                        <SizeArrayField sizeList={sizeData.sizes} />
                     </Col>

                     <Col span={12} order={6}>
                        <div className='flex flex-col mb-4 space-y-1'>
                           <label htmlFor='desc' className='font-medium'>
                              {t('label.thumb', { ns: 'mutual' })}

                              <span className='ml-0.5 text-red-500 '>*</span>
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
                              {t('label.images', { ns: 'mutual' })}

                              <span className='ml-0.5 text-red-500 '>*</span>
                           </label>
                           <UploadImages />
                        </div>
                     </Col>
                  </Row>
               </div>
               <div className='flex justify-start mt-6 space-x-2'>
                  <Button
                     onClick={onSubmit}
                     className='w-32 h-8 bg-blue-800 hover:bg-blue-900'
                  >
                     {t('action.create', { ns: 'mutual' })}
                  </Button>
               </div>
            </FormProvider>
         </ProductFormContext.Provider>
      )
   );
};

export default CreateForm;
