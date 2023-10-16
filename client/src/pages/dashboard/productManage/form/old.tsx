import * as z from 'zod';
import { Col, Row } from 'antd';
import React, { FC, SetStateAction, createContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQueries } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';

import UploadThumbnail from './components/ImageField';
import ColorArrayField from './components/SizeArrayField';
import {
   Input,
   Error,
   Button,
   TextArea,
   Dropdown,
   Skeleton,
} from '@/components';

import { productSchema } from '@/zod';
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

interface ProductFormProps {
   value: ProductFormValue;
   submit: (value: ProductFormValue) => void;
   deleteImages?: (images: string[]) => void;
}

const ProductForm: FC<ProductFormProps> = ({ value, submit, deleteImages }) => {
   const { slug } = useParams();
   const [isDetail, setIsDetail] = useState<boolean>(true);
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
            queryKey: ['colors'],
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

   const onSubmit = handleSubmit(async (value) => {
      const category_id = categoryData?.categories.find(
         (category) => category.name === value.category
      )?._id as string;

      // const colors_id = value.colors.map((color) => {
      //    const newColor = {
      //       ...color,
      //       color: colorData?.colors.find((item) => item.name === color.color)
      //          ?._id as string,
      //    };
      //    return newColor;
      // });
      // const newValue = { ...value, category: category_id, colors: colors_id };

      // submit(newValue);
      // if (imagesDelete.length > 0 && deleteImages) {
      //    deleteImages(imagesDelete);
      // }
   });

   if (loading1 || loading2 || loading3) {
      return <Skeleton />;
   }

   const discount = watch('discount');

   // const checkBasicError = async () => {
   //    return await trigger([
   //       'name',
   //       'genders',
   //       'category',
   //       'prices',
   //       'store',
   //       'discount.value',
   //    ]);
   // };

   return (
      colorData?.colors &&
      sizeData?.sizes &&
      categoryData?.categories && (
         <ProductFormContext.Provider
            value={{ colorList: colorData?.colors, setImagesDelete }}
         >
            <FormProvider {...props}>
               {!isDetail ? (
                  <div className='space-y-2'>
                     <h3 className='text-lg'>Thông tin cơ bản</h3>
                     <div className='flex flex-col'>
                        <div className='p-4 mt-2 rounded-md shadow-db dark:shadow-dark_db'>
                           <Row gutter={[36, 8]}>
                              {/* NAME */}
                              <Col span={12} className='space-y-8' order={1}>
                                 <div className='flex flex-col space-y-1'>
                                    <label
                                       htmlFor='name'
                                       className='font-medium'
                                    >
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
                                    <label
                                       htmlFor='store'
                                       className='font-medium'
                                    >
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
                                                   getValues('colors').forEach(
                                                      (_, index) => {
                                                         setValue(
                                                            `colors.${index}.sizes`,
                                                            [
                                                               {
                                                                  size: '',
                                                                  stock: 0,
                                                               },
                                                            ]
                                                         );
                                                      }
                                                   );
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
                                    <label
                                       htmlFor='category'
                                       className='font-medium'
                                    >
                                       {t('table.category')}
                                    </label>
                                    <Dropdown
                                       items={categoryData.categories
                                          .filter((item) => {
                                             return (
                                                item.store ===
                                                getValues('store')
                                             );
                                          })
                                          .map((item) => ({
                                             label: (
                                                <div
                                                   className='capitalize'
                                                   onClick={() => {
                                                      setValue(
                                                         'category',
                                                         item.name
                                                      );
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
                                    <label
                                       htmlFor='genders'
                                       className='font-medium'
                                    >
                                       {t('form.genders')}
                                    </label>
                                    <Dropdown
                                       items={genders.map((gender) => ({
                                          label: (
                                             <div
                                                className='capitalize'
                                                onClick={() => {
                                                   setValue('genders', [
                                                      gender,
                                                   ]);
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
                                    <label
                                       htmlFor='price'
                                       className='font-medium'
                                    >
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
                                          isError={
                                             !!errors.prices?.originalPrice
                                          }
                                       />
                                    </div>
                                    <Error
                                       message={
                                          errors.prices?.originalPrice?.message
                                       }
                                    />
                                 </div>
                              </Col>

                              {/* DISCOUNT */}
                              <Col span={12} order={5}>
                                 <div className='relative flex flex-col space-y-1'>
                                    <label
                                       htmlFor='discount'
                                       className='font-medium'
                                    >
                                       Discount
                                    </label>
                                    <div className='flex'>
                                       <div className='w-8 border-r-0 flex border justify-center items-center border-gray-400 dark:border-[#3f4244]'>
                                          <Dropdown
                                             items={[
                                                {
                                                   label: (
                                                      <p
                                                         onClick={() => {
                                                            console.log(
                                                               getValues()
                                                            );

                                                            setValue(
                                                               'discount',
                                                               {
                                                                  type: 'percent',
                                                                  value: 0,
                                                               }
                                                            );
                                                         }}
                                                      >
                                                         Percent
                                                      </p>
                                                   ),
                                                },
                                                {
                                                   label: (
                                                      <p
                                                         onClick={() =>
                                                            setValue(
                                                               'discount',
                                                               {
                                                                  type: 'default',
                                                                  value: 0,
                                                               }
                                                            )
                                                         }
                                                      >
                                                         Vnđ
                                                      </p>
                                                   ),
                                                },
                                             ]}
                                          >
                                             {discount.type === 'percent'
                                                ? '%'
                                                : 'đ'}
                                          </Dropdown>
                                       </div>
                                       <Input
                                          type='number'
                                          placeholder='Product discount (vnđ)'
                                          {...register('discount.value', {
                                             valueAsNumber: true,
                                          })}
                                          className='flex-1 rounded-tl-none rounded-bl-none'
                                          isError={!!errors.discount?.value}
                                       />
                                    </div>
                                    <Error
                                       message={errors.discount?.value?.message}
                                    />
                                 </div>
                              </Col>

                              <Col span={12} order={6}>
                                 <div className='flex flex-col space-y-1'>
                                    <label
                                       htmlFor='desc'
                                       className='font-medium'
                                    >
                                       {t('form.description')}
                                    </label>
                                    <TextArea {...register('desc')} rows={4} />
                                 </div>
                              </Col>
                           </Row>
                        </div>
                     </div>
                  </div>
               ) : (
                  <div className='space-y-2'>
                     <h3 className='text-lg'>{t('form.details')}</h3>
                     <Row gutter={[36, 36]}>
                        <Col span={12} className=''>
                           <div className='p-4 pr-12 space-y-1 rounded-md shadow-db dark:shadow-dark_db'>
                              <span className='font-medium'>
                                 {' '}
                                 {t('aside.color')}
                              </span>
                              <ColorArrayField
                                 sizeList={sizeData.sizes}
                                 colorList={colorData.colors}
                              />
                           </div>
                        </Col>
                        <Col span={12}>
                           <div className='p-4 pr-12 rounded-md shadow-db dark:shadow-dark_db'>
                              <UploadThumbnail />
                           </div>
                        </Col>
                     </Row>
                  </div>
               )}
               <div className='flex justify-start mt-6 space-x-2'>
                  {!isDetail ? (
                     <Button
                        onClick={async () =>
                           (await checkBasicError()) && setIsDetail(true)
                        }
                        className='w-32 h-8 bg-blue-800 hover:bg-blue-900'
                     >
                        Tiếp theo
                     </Button>
                  ) : (
                     <>
                        <Button
                           onClick={onSubmit}
                           className='w-32 h-8 bg-blue-800 hover:bg-blue-900'
                        >
                           {t(slug ? 'action.save' : 'action.create')}
                        </Button>
                        <Button
                           onClick={() => setIsDetail(false)}
                           className='w-32 h-8  bg-gray-600 dark:bg-[rgba(255,255,255,0.1)] hover:bg-gray-700 dark:hover:bg-[rgba(255,255,255,0.05)] opacity-75 '
                        >
                           {t('action.cancel')}
                        </Button>
                     </>
                  )}
               </div>
            </FormProvider>
         </ProductFormContext.Provider>
      )
   );
};

export default ProductForm;
