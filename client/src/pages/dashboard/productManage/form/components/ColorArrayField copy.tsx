import { Col, Row } from 'antd';
import { FC, memo, Fragment, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useFieldArray, useFormContext } from 'react-hook-form';

import { BsTrash } from 'react-icons/bs';
import { IoIosAddCircleOutline } from 'react-icons/io';

import { Button, Dropdown, Input, Error } from '@/components';

import { IColor, ISize } from '@/types';
import { ProductFormValue } from '@/types/product';
import { ProductFormContext } from '../ProductForm';

interface ColorArrayFieldProps {
   sizeList: ISize[];
   colorList: IColor[];
}

const ColorArrayField: FC<ColorArrayFieldProps> = ({ colorList, sizeList }) => {
   const {
      control,
      register,
      setValue,
      getValues,
      clearErrors,
      formState: { errors },
   } = useFormContext<ProductFormValue>();

   const { fields, append, remove } = useFieldArray({
      control,
      name: 'variants',
   });
   const { setImagesDelete } = useContext(ProductFormContext);

   const { t } = useTranslation('dashboard', { keyPrefix: 'form' });
   const onChooes = (index: number, colorItem: IColor) => {
      setValue(`variants.${index}.color`, colorItem.name);
      clearErrors(`variants.${index}.color`);
   };

   return (
      <div>
         <ul className='space-y-4'>
            {fields.map((item, index) => {
               return (
                  <li key={item.id}>
                     <Dropdown
                        items={colorList.map((colorItem) => ({
                           label: (
                              <div
                                 className='flex items-center capitalize'
                                 onClick={() => onChooes(index, colorItem)}
                              >
                                 <div
                                    className='w-3 mr-2 rounded-full aspect-square'
                                    style={{
                                       backgroundColor: colorItem.value,
                                    }}
                                 ></div>
                                 {colorItem.name}
                              </div>
                           ),
                        }))}
                        children={
                           <div className='relative'>
                              <Input
                                 placeholder='Choose a color'
                                 className='w-full appearance capitalize !pl-8 focus:cursor-pointer'
                                 {...register(`variants.${index}.color`)}
                                 isError={!!errors?.variants?.[index]?.color}
                                 readOnly
                              />
                              <div
                                 className='absolute -translate-y-1/2 rounded-full top-1/2 left-2 h-1/2 aspect-square'
                                 style={{
                                    backgroundColor: colorList.find(
                                       (item) =>
                                          item.name ===
                                          getValues(`variants.${index}.color`)
                                    )?.value,
                                 }}
                              ></div>
                              {getValues('variants').length > 1 && (
                                 <div
                                    className='absolute top-0 ml-2 duration-150 translate-y-3 left-full hover:scale-105'
                                    onClick={() => {
                                       const { thumbnail, images } = getValues(
                                          `variants.${index}`
                                       );
                                       setImagesDelete((state) => [
                                          ...state,
                                          thumbnail.public_id,
                                          ...images
                                             .filter(
                                                (item) =>
                                                   item.public_id.slice(
                                                      0,
                                                      8
                                                   ) === 'nikeshop'
                                             )
                                             .map((item) => item.public_id),
                                       ]);

                                       remove(index);
                                    }}
                                 >
                                    <BsTrash size={18} />
                                 </div>
                              )}
                           </div>
                        }
                     />
                     <Error
                        message={errors?.variants?.[index]?.color?.message}
                     />
                     <SizeArrayField
                        parentIndex={index}
                        sizeList={sizeList}
                        {...{ control, register, setValue }}
                     />
                  </li>
               );
            })}
         </ul>

         <Button
            className='flex items-center justify-center w-full h-10 space-x-1 bg-transparent border text-[#3e3e3e] dark:text-[#d5d6d7] border-gray-600 border-dashed dark:border-gray-300 hover:bg-transparent '
            onClick={() =>
               append({
                  color: '',
                  sizes: [
                     {
                        size: '',
                        stock: 50,
                     },
                  ],
                  thumbnail: {
                     public_id: '',
                     url: '',
                  },
                  images: [],
               })
            }
         >
            <IoIosAddCircleOutline color='inherit' size={18} />
            <span>{t('addMoreColor')}</span>
         </Button>
      </div>
   );
};

const SizeArrayField: FC<{
   parentIndex: number;
   sizeList: ISize[];
}> = ({ parentIndex, sizeList }) => {
   const {
      control,
      register,
      setValue,
      getValues,
      clearErrors,
      formState: { errors },
   } = useFormContext<ProductFormValue>();

   const { fields, append, remove } = useFieldArray({
      control,
      name: `variants.${parentIndex}.sizes`,
   });

   const { t } = useTranslation('dashboard');

   const onChooes = (index: number, sizeItem: ISize) => {
      setValue(`variants.${parentIndex}.sizes.${index}.size`, sizeItem.name);
      clearErrors(`variants.${parentIndex}.sizes.${index}.size`);
   };

   const onDelete = (index: number) => {
      remove(index);
   };

   return (
      <div className='ml-12'>
         {getValues(`variants.${parentIndex}.sizes`).length > 0 && (
            <Row gutter={16} className='mb-2'>
               <Col span={12}>{t('aside.size')}</Col>
               <Col span={12}>{t('form.stock')}</Col>
            </Row>
         )}
         <Row gutter={[16, 8]} className='relative'>
            {fields.map((item, index) => {
               return (
                  <Fragment key={item.id}>
                     <Col span={12}>
                        <Dropdown
                           items={sizeList
                              .filter(
                                 (sizeItem) =>
                                    sizeItem.store === getValues('store')
                              )
                              .map((sizeItem) => ({
                                 label: (
                                    <div
                                       className='uppercase'
                                       onClick={() => onChooes(index, sizeItem)}
                                    >
                                       {sizeItem.name}
                                    </div>
                                 ),
                              }))}
                           children={
                              <Input
                                 placeholder='Choose a size'
                                 className='w-full uppercase appearance focus:cursor-pointer placeholder:normal-case'
                                 {...register(
                                    `variants.${parentIndex}.sizes.${index}.size`
                                 )}
                                 isError={
                                    !!errors?.variants?.[parentIndex]?.sizes?.[
                                       index
                                    ]?.size
                                 }
                                 readOnly
                              />
                           }
                        />
                        <Error
                           message={
                              errors?.variants?.[parentIndex]?.sizes?.[index]
                                 ?.size?.message
                           }
                        />
                     </Col>
                     <Col span={12} className='relative'>
                        <Input
                           type='number'
                           {...register(
                              `variants.${parentIndex}.sizes.${index}.stock`,
                              {
                                 valueAsNumber: true,
                              }
                           )}
                           isError={
                              !!errors?.variants?.[parentIndex]?.sizes?.[index]
                                 ?.stock
                           }
                           className='w-full'
                        />
                        <Error
                           message={
                              errors?.variants?.[parentIndex]?.sizes?.[index]
                                 ?.stock?.message
                           }
                        />
                        {getValues(`variants.${parentIndex}.sizes`).length >
                           1 && (
                           <div
                              className='absolute top-0 duration-150 translate-y-3 cursor-pointer left-full hover:scale-105'
                              onClick={() => onDelete(index)}
                           >
                              <BsTrash size={18} />
                           </div>
                        )}
                     </Col>
                  </Fragment>
               );
            })}
         </Row>
         <div className='w-1/2 pr-2 mt-2 mb-4'>
            <Button
               className='flex items-center justify-center w-full h-10 space-x-1 text-xs bg-transparent border border-gray-600 border-dashed text-[#3e3e3e] dark:text-[#d5d6d7]dark:border-gray-300 hover:bg-transparent dark:text-white'
               type='button'
               onClick={() => {
                  append({
                     size: '',
                     stock: 50,
                  });
                  clearErrors(`variants.${parentIndex}`);
               }}
            >
               <IoIosAddCircleOutline color='inherit' size={18} />
               <span>{t('form.addMoreSize')}</span>
            </Button>
         </div>
      </div>
   );
};

export default memo(ColorArrayField);
