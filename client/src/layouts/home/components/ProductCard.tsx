import { dateFormat, priceFormat } from '@/helpers';
import { IProduct } from '@/types';
import { BsStarFill } from 'react-icons/bs';
import moment from 'moment';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import { useNavigate } from 'react-router-dom';
import cartStore from '@/stores/cartStore';
import { useTranslation } from 'react-i18next';

interface ProductCardProps {
   data: IProduct;
   isNew?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ data }) => {
   const numOfColor = data.variants.length;
   const navigate = useNavigate();
   const { addItem } = cartStore();
   const { t, i18n } = useTranslation('home');
   const isVn = i18n.language === 'vi';
   const { discount } = data;

   const isSale = data.discount > 0;
   const saleValue = `${data.discount}%`;

   return (
      <div
         className='relative flex flex-col h-full'
         onClick={() => navigate('/d/' + data.slug)}
      >
         {isSale && (
            <div className='absolute z-50 px-3 py-1 text-xs text-white bg-orange-500 rounded-sm top-2 right-2 w-fit'>
               -{saleValue}
            </div>
         )}
         <div className='w-full overflow-hidden rounded-sm aspect-square group'>
            <Swiper modules={[Pagination]} spaceBetween={4}>
               {data.variants.map((item, index) => (
                  <SwiperSlide key={index}>
                     <img
                        src={item.thumbnail.url}
                        className='duration-200 cursor-pointer hover:scale-105'
                     />
                  </SwiperSlide>
               ))}
            </Swiper>
         </div>
         <div className='flex flex-col flex-1 p-3 rounded-bl rounded-br'>
            <div className='flex-1 text-15 line-clamp-1'>{data.name}</div>

            <span className='flex-1 text-xs capitalize line-clamp-1'>
               {data.category.name} {data.category.store}
            </span>
            <div className='relative flex items-center mt-4 space-x-2'>
               <span className='text-base font-semibold text-red-500'>
                  {priceFormat(data.prices.price)}
               </span>
               {isSale && (
                  <span className='line-through italic text-[#707072] opacity-80'>
                     {priceFormat(data.prices.originalPrice)}
                  </span>
               )}
            </div>
         </div>
      </div>
   );
};

export default ProductCard;
