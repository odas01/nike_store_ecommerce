import { ProductFormValue, Image as IImage } from '@/types';
import { FC, useContext } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { ProductFormContext } from '../ProductForm';
import { Col, Row } from 'antd';
import { UploadButton } from '@/components';
import { FiTrash } from 'react-icons/fi';

const UploadImageList = () => {
   const { control } = useFormContext<ProductFormValue>();
   const { setImagesDelete } = useContext(ProductFormContext);
   const { fields, append, remove } = useFieldArray({
      control,
      name: 'images',
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

export default UploadImageList;
