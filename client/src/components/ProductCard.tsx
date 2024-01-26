import { Pagination } from 'swiper/modules';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Swiper, SwiperSlide } from 'swiper/react';

import { IProduct } from '@/types';
import { priceFormat } from '@/helpers';

interface ProductCardProps {
   data: IProduct;
   isNew?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ data }) => {
   const navigate = useNavigate();

   const { i18n } = useTranslation('home');
   const isVnLang = i18n.language === 'vi';

   const isSale = data.discount > 0;
   const saleValue = `${data.discount}%`;

   return (
      <div
         className='relative flex flex-col h-full'
         onClick={() => navigate('/d/' + data.slug)}
      >
         {isSale && (
            <span className='absolute z-50 px-2 py-1 text-white bg-orange-500 rounded-sm md:px-3 xl:text-xs text-10 top-2 right-2 w-fit'>
               -{saleValue}
            </span>
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
         <div className='flex flex-col flex-1 p-1 rounded-bl rounded-br md:p-3'>
            <span className='flex-1 text-sm font-medium md:text-15 line-clamp-1'>
               {data.name}
            </span>

            <span className='flex-1 capitalize md:text-xs text-11 line-clamp-1'>
               {data.category.name} {data.category.store}
            </span>
            <div className='relative flex items-center mt-1 space-x-2 md:mt-2'>
               <span className='text-sm font-semibold text-red-500 xl:text-base'>
                  {priceFormat(data.prices.price, isVnLang)}
               </span>
               {isSale && (
                  <span className='line-through italic text-[#707072] opacity-80 xl:text-15 text-13'>
                     {priceFormat(data.prices.originalPrice, isVnLang)}
                  </span>
               )}
            </div>
         </div>
      </div>
   );
};

export default ProductCard;
