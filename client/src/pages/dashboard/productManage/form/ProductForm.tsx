import { Col, Row } from 'antd';
import React, { FC, SetStateAction, createContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQueries } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';

import { UploadImages } from './components/ImageField';
import SizeArrayField from './components/SizeArrayField';
import {
   Input,
   Error,
   Button,
   TextArea,
   Dropdown,
   Skeleton,
   UploadButton,
} from '@/components';

import { productSchema } from '@/zod';
import { IColor, ProductFormValue } from '@/types';
import { categoryApi, colorApi, sizeApi } from '@/api';
import { genders, store as storeConst } from '@/constants';
import { Image } from './components/ImageField';

interface ProductFormContext {
   colorList: IColor[];
   setImagesDelete: React.Dispatch<SetStateAction<string[]>>;
}

export const ProductFormContext = createContext<ProductFormContext>(
   {} as ProductFormContext
);

interface ProductFormProps {
   value: ProductFormValue;
   submit: (value: ProductFormValue) => void;
   deleteImages?: (images: string[]) => void;
}

const ProductForm: FC<ProductFormProps> = ({ value, submit, deleteImages }) => {
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
         { queryKey: ['sizes'], queryFn: () => sizeApi.getAll() },
         { queryKey: ['categories'], queryFn: () => categoryApi.getAll() },
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

      prices.price =
         prices.originalPrice - (prices.originalPrice * discount) / 100;

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
               <div className='space-y-2'>
                  <h3 className='text-lg'>Thông tin cơ bản</h3>
                  <div className='rounded-md shadow-db dark:shadow-dark_db'>
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
                                          className='flex items-center capitalize'
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
                                       <div
                                          className='capitalize'
                                          onClick={() => {
                                             setValue('store', store);
                                             setValue('category', '');

                                             clearErrors('store');
                                          }}
                                       >
                                          {store}
                                       </div>
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
                                          <div
                                             className='capitalize'
                                             onClick={() => {
                                                setValue('category', item.name);
                                                clearErrors('category');
                                             }}
                                          >
                                             {item.name}
                                          </div>
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
                        <Col span={12} order={2}>
                           <div className='flex flex-col space-y-1'>
                              <label htmlFor='genders' className='font-medium'>
                                 {t('form.genders')}
                              </label>
                              <Dropdown
                                 items={genders.map((gender) => ({
                                    label: (
                                       <div
                                          className='capitalize'
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
                        <Col span={12} order={3}>
                           <div className='relative flex flex-col space-y-1'>
                              <label htmlFor='price' className='font-medium'>
                                 {t('table.price')}
                              </label>
                              <div className='flex'>
                                 <p className=' border border-r-0 w-8 flex justify-center items-center border-gray-400 dark:border-[#3f4244]'>
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
                                 <p className=' border border-r-0 w-8 flex justify-center items-center border-gray-400 dark:border-[#3f4244]'>
                                    đ
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

export default ProductForm;
