import * as z from 'zod';
import { Col, Row } from 'antd';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import {
   Input,
   Error,
   Button,
   TextArea,
   Dropdown,
   Skeleton,
} from '@/components';

import { categoryApi } from '@/api';
import { ProductEdit } from '@/types';
import { genders, store as storeConst } from '@/constants';

const productSchema = z.object({
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
});

interface EditFormProps {
   value: ProductEdit;
   submit: (value: ProductEdit) => void;
}

const EditForm: React.FC<EditFormProps> = ({ value, submit }) => {
   const { t } = useTranslation(['dashboard', 'mutual']);
   const props = useForm<ProductEdit>({
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
      formState: { errors },
   } = props;

   const { data, isLoading } = useQuery({
      queryKey: ['categories'],
      queryFn: () =>
         categoryApi.getAll({
            skip: 0,
            limit: 100,
         }),
   });

   const onSubmit = handleSubmit(async (values) => {
      const { prices, discount, category, ...value } = values;

      // category
      const category_id = data?.categories.find(
         (item) => item.name === category
      )?._id as string;

      if (prices && discount) {
         prices.price =
            prices.originalPrice - (prices.originalPrice * discount) / 100;
      }

      const newValue = {
         ...value,
         category: category_id,
         prices,
         discount,
         status: 'hide',
      };

      submit(newValue);
   });

   if (isLoading) {
      return <Skeleton />;
   }

   return (
      data?.categories && (
         <>
            <div className='p-4 rounded-md shadow-db dark:shadow-dark_db'>
               <Row gutter={[36, 8]}>
                  {/* NAME */}
                  <Col span={12} className='space-y-8' order={1}>
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
                  <Col span={12} order={5}>
                     <div className='flex flex-col space-y-1'>
                        <label htmlFor='store' className='font-medium'>
                           {t('label.store', { ns: 'mutual' })}
                           <span className='ml-0.5 text-red-500 '>*</span>
                        </label>
                        <Dropdown
                           items={storeConst.map((store) => ({
                              label: (
                                 <div
                                    className='px-3 py-2 capitalize'
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
                           items={data.categories
                              .filter((item) => {
                                 return item.store === getValues('store');
                              })
                              .map((item) => ({
                                 label: (
                                    <div
                                       className='px-3 py-2 capitalize'
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
                                    {/* {t(`gender.${gender as Gender}`, {
                                       ns: 'mutual',
                                    })} */}
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
                  <Col span={12} order={3}>
                     <div className='relative flex flex-col space-y-1'>
                        <label htmlFor='price' className='font-medium'>
                           {t('label.price', { ns: 'mutual' })}
                           <span className='ml-0.5 text-red-500 '>*</span>
                        </label>
                        <div className='flex'>
                           <p className=' border border-r-0 w-8 flex justify-center items-center border-gray-400 dark:border-[#3f4244]'>
                              đ
                           </p>
                           <Input
                              type='number'
                              placeholder={t('placeholderForm.product.price')}
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
                           <p className=' border border-r-0 w-8 flex justify-center items-center border-gray-400 dark:border-[#3f4244]'>
                              đ
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
                        </label>
                        <TextArea {...register('desc')} rows={4} />
                     </div>
                  </Col>
               </Row>
            </div>
            <div className='flex justify-start mt-6 space-x-2'>
               <Button
                  onClick={onSubmit}
                  className='w-32 h-8 bg-blue-800 hover:bg-blue-900'
               >
                  {t('action.save', { ns: 'mutual' })}
               </Button>
            </div>
         </>
      )
   );
};

export default EditForm;
