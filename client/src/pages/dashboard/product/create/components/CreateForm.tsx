import * as z from 'zod';
import { Col, Row } from 'antd';
import React, { FC, SetStateAction, createContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQueries } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';

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

import { IColor, ProductFormValue } from '@/types';
import { categoryApi, colorApi, sizeApi } from '@/api';
import { genders, store as storeConst } from '@/constants';

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
   desc: z.string(),
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
   const { slug } = useParams();
   const [isDetail, setIsDetail] = useState<boolean>(false);
   const [imagesDelete, setImagesDelete] = useState<string[]>([]);

   const { t } = useTranslation('dashboard');

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
      trigger,
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
            queryKey: ['sizes'],
            queryFn: () =>
               sizeApi.getAll({
                  skip: 0,
                  limit: 100,
               }),
         },
         {
            queryKey: ['categories'],
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

      console.log(values);

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
      console.log(newValue);

      submit(newValue);
      if (imagesDelete.length > 0 && deleteImages) {
         deleteImages(imagesDelete);
      }
   });

   if (loading1 || loading2 || loading3) {
      return <Skeleton />;
   }

   const discount = watch('discount');
   const thumbnail = watch('thumbnail');
   console.log(errors);

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
                              {t('table.name')}
                           </label>
                           <Input
                              placeholder='Product name'
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
                              {t('aside.color')}
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
                                    placeholder='Choose a store'
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
                              {t('table.store')}
                           </label>
                           <Dropdown
                              items={storeConst.map((store) => ({
                                 label: (
                                    <p
                                       className='px-3 py-2 capitalize'
                                       onClick={() => {
                                          setValue('store', store);
                                          setValue('category', '');

                                          clearErrors('store');
                                       }}
                                    >
                                       {store}
                                    </p>
                                 ),
                              }))}
                              children={
                                 <Input
                                    placeholder='Choose a store'
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
                              {t('table.category')}
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
                                    placeholder='Choose a category'
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
                              {t('form.genders')}
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
                                    placeholder='Choose a gender'
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
                              {t('table.price')}
                           </label>
                           <div className='flex'>
                              <p className=' border border-r-0 w-8 flex rounded-l justify-center items-center border-gray-400 dark:border-[#3f4244]'>
                                 đ
                              </p>
                              <Input
                                 type='number'
                                 placeholder='Product price (vnđ)'
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
                              Discount
                           </label>
                           <div className='flex'>
                              <p className=' border border-r-0 w-8 flex justify-center rounded-l items-center border-gray-400 dark:border-[#3f4244]'>
                                 %
                              </p>
                              <Input
                                 type='number'
                                 placeholder='Product price (vnđ)'
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
                              {t('form.description')}
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
               </div>
               <div className='flex justify-start mt-6 space-x-2'>
                  <Button
                     onClick={onSubmit}
                     className='w-32 h-8 bg-blue-800 hover:bg-blue-900'
                  >
                     Tiếp theo
                  </Button>
               </div>
            </FormProvider>
         </ProductFormContext.Provider>
      )
   );
};

export default CreateForm;
