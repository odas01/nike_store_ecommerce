import { Col, Row } from 'antd';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { useEffect, useState, memo, FC, useContext } from 'react';

import { FiTrash } from 'react-icons/fi';

import { UploadButton } from '@/components';

import { ProductFormContext } from '../ProductForm';
import { VariantForm, ProductFormValue, Image as IImage } from '@/types';

const UploadThumbnail = () => {
   const { watch, getValues, setValue, clearErrors } =
      useFormContext<ProductFormValue>();

   const { colorList } = useContext(ProductFormContext);

   const [variants, setVariants] = useState<VariantForm[]>(
      getValues('variants')
   );

   const { t } = useTranslation('dashboard', { keyPrefix: 'form' });

   useEffect(() => {
      setVariants(getValues('variants'));
   }, [watch('variants')]);

   const onRemove = (index: number) => {
      setValue(`variants.${index}.thumbnail`, {
         public_id: '',
         url: '',
      });
   };

   const onChooesThumbmail = (index: number) => (data: IImage[]) => {
      setValue(`variants.${index}.thumbnail`, data[0]);
      clearErrors(`variants.${index}.thumbnail`);
   };

   return (
      <div className='flex flex-col space-y-8'>
         {variants.map(({ thumbnail, color }, index) => {
            const colorValue: string = colorList.find(
               (item) => item.name === color
            )?.value!;
            return (
               <div key={index} className='flex space-x-4'>
                  <div className='flex flex-col space-y-1'>
                     <span className='text-sm font-medium'>
                        {t('thumbnail')}
                     </span>
                     <div className='flex space-x-4'>
                        <div className='flex flex-col items-center space-y-3 w-fit'>
                           {thumbnail.url ? (
                              <Image
                                 url={thumbnail.url}
                                 onRemove={() => onRemove(index)}
                              />
                           ) : (
                              <UploadButton
                                 setValue={onChooesThumbmail(index)}
                              />
                           )}
                           {color && (
                              <div className='flex items-center space-x-1'>
                                 <div
                                    className='w-4 rounded-full aspect-square'
                                    style={{
                                       backgroundColor: colorValue,
                                    }}
                                 ></div>
                                 <span className='text-xs'>
                                    {color.toUpperCase()}
                                 </span>
                              </div>
                           )}
                        </div>
                     </div>
                  </div>
                  <div className='flex flex-col space-y-1'>
                     <span className='text-sm font-medium'>
                        {t('imageList')}
                     </span>
                     <div>
                        <ImageList parentIndex={index} />
                     </div>
                  </div>
               </div>
            );
         })}
      </div>
   );
};

const ImageList: FC<{
   parentIndex: number;
}> = ({ parentIndex }) => {
   const { control } = useFormContext<ProductFormValue>();
   const { setImagesDelete } = useContext(ProductFormContext);
   const { fields, append, remove } = useFieldArray({
      control,
      name: `variants.${parentIndex}.images`,
   });

   const onRemove = (index: number, public_id: string) => {
      const isB64 = public_id.slice(0, 8) !== 'nikeshop';
      if (!isB64) {
         setImagesDelete((state) => [...state, public_id]);
      }
      remove(index);
   };

   const onAppend = (data: IImage[]) => {
      append(data);
   };

   return (
      <Row gutter={[16, 16]}>
         {fields.map((item, index) => (
            <Col key={index}>
               <Image
                  url={item.url}
                  onRemove={() => onRemove(index, item.public_id)}
               />
            </Col>
         ))}
         <Col>
            <UploadButton multiple setValue={onAppend} />
         </Col>
      </Row>
   );
};

export const Image: FC<{
   url: string;
   onRemove: () => void;
}> = ({ url, onRemove }) => {
   return (
      <div className='relative w-[100px] aspect-square rounded overflow-hidden'>
         <img src={url} alt='img' />
         <div className='absolute opacity-0 hover:opacity-100 duration-300 left-0 top-0 flex-center gap-3 h-full w-full bg-[rgba(0,0,0,0.3)]'>
            <div className='absolute inline-block p-1 bg-red-500 rounded cursor-pointer right-1 top-1'>
               <FiTrash
                  size={12}
                  className='duration-300 hover:scale-105'
                  onClick={onRemove}
               />
            </div>
         </div>
      </div>
   );
};

export default memo(UploadThumbnail);
