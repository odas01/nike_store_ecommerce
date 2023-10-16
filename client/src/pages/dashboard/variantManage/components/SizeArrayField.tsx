import { Col, Row } from 'antd';
import { FC, memo, Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import { useFieldArray, useFormContext } from 'react-hook-form';

import { BsTrash } from 'react-icons/bs';
import { IoIosAddCircleOutline } from 'react-icons/io';

import { Button, Dropdown, Input, Error } from '@/components';

import { ISize } from '@/types';
import { ProductFormValue } from '@/types/product';

const SizeArrayField: FC<{
   sizeList: ISize[];
   store: string;
}> = ({ sizeList, store }) => {
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
      name: `sizes`,
   });

   const { t } = useTranslation('dashboard');

   const onChooes = (index: number, sizeItem: ISize) => {
      setValue(`sizes.${index}.size`, sizeItem.name);
      clearErrors(`sizes.${index}.size`);
   };

   const onDelete = (index: number) => {
      remove(index);
   };

   return (
      <div className='pr-8 space-y-1'>
         {getValues(`sizes`).length > 0 && (
            <Row gutter={16}>
               <Col span={16}>{t('aside.size')}</Col>
               <Col span={8}>{t('form.stock')}</Col>
            </Row>
         )}
         <Row gutter={16} className='relative'>
            {fields.map((item, index) => {
               return (
                  <Fragment key={item.id}>
                     <Col span={16}>
                        <Dropdown
                           items={sizeList
                              .filter((sizeItem) => sizeItem.store === store)
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
                                 {...register(`sizes.${index}.size`)}
                                 isError={!!errors?.sizes?.[index]?.size}
                                 readOnly
                              />
                           }
                        />
                        <Error
                           message={errors?.sizes?.[index]?.size?.message}
                        />
                     </Col>
                     <Col span={8} className='relative'>
                        <Input
                           type='number'
                           {...register(`sizes.${index}.stock`, {
                              valueAsNumber: true,
                           })}
                           isError={!!errors?.sizes?.[index]?.stock}
                           className='w-full'
                        />
                        <Error
                           message={errors?.sizes?.[index]?.stock?.message}
                        />
                        {getValues(`sizes`).length > 1 && (
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
               }}
            >
               <IoIosAddCircleOutline color='inherit' size={18} />
               <span>{t('form.addMoreSize')}</span>
            </Button>
         </div>
      </div>
   );
};

export default memo(SizeArrayField);
