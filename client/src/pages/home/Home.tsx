import { useState } from 'react';
import { Col, Row, Spin } from 'antd';
import { Link } from 'react-router-dom';
import { twMerge } from 'tailwind-merge';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, FreeMode } from 'swiper/modules';

import { BsArrowRight } from 'react-icons/bs';

import 'swiper/css/scrollbar';

import { PageTitle } from '@/components';
import ProductCard from '@/layouts/home/components/ProductCard';

import { productApi } from '@/api';
import images from '@/assets/images';

const Home = () => {
   const [isTop, setIsTop] = useState<boolean>(true);

   const { t } = useTranslation('home');

   const newProduct = useQuery({
      queryKey: ['product'],
      queryFn: () =>
         productApi.getAll({
            skip: 0,
            limit: 20,
            sort: 'sold:-1',
            gte: 'sold:1',
            status: 'show',
         }),
   });

   const { data, isLoading } = useQuery({
      queryKey: ['products', isTop],
      queryFn: () =>
         productApi.getAll({
            skip: 0,
            limit: 10,
            sort: isTop ? 'createdAt:-1' : 'discount:-1',
            gte: isTop ? '' : 'discount:1',
            status: 'show',
         }),
   });

   return (
      <>
         <PageTitle title='Nike Store' />
         <div className='relative banner'>
            <img
               src={images.bannerr}
               alt=''
               className='w-[580px] absolute right-28 bottom-0 object-contain'
            />

            <div className='absolute text-white flex-column top-1/3 left-28'>
               <span className='font-nikeFutura tracking-[8px] text-8xl overflow-hidden whitespace-nowrap animate-typing'>
                  JUST DO IT
               </span>
               <span className='mt-2 text-3xl italic font-nikeFutura'>
                  Play With Electric Nike Shoes
               </span>
               <Link
                  to='/shop'
                  className='relative px-5 py-3 mt-24 text-black bg-white rounded-full cursor-pointer flex-center w-fit group'
               >
                  <span className='z-10 mr-4 text-lg font-medium duration-300 group-hover:text-white'>
                     {t('cart.startShopping')}
                  </span>
                  <div className='z-10 p-2 pr-0 rounded-full flex-center'>
                     <BsArrowRight color='#fff' />
                  </div>
                  <div className='absolute right-[10px] w-10 h-10 bg-[#181823] rounded-full duration-300 group-hover:w-[102%] group-hover:h-[102%] group-hover:right-[-1px]'></div>
               </Link>
            </div>
         </div>

         <div className='container py-10 space-y-16'>
            <div className='space-y-3'>
               <h2 className='text-2xl font-medium'>{t('home.bestSeller')}</h2>
               <Swiper
                  spaceBetween={8}
                  slidesPerView={5}
                  modules={[Autoplay, FreeMode]}
               >
                  {newProduct?.data?.products.map((item, index) => (
                     <SwiperSlide key={index}>
                        <ProductCard data={item} />
                     </SwiperSlide>
                  ))}
               </Swiper>
            </div>
            <div className='text-center'>
               <h1 className='text-5xl uppercase font-nikeFutura'>
                  Just do it
               </h1>
               <Link
                  to='shop'
                  className='mt-4 bg-[#181823] text-white inline-block px-5 py-2 rounded-full 
                    cursor-pointer hover:opacity-80 hover:text-white'
               >
                  {t('home.shopNow')}
               </Link>
            </div>
            <div className='flex'>
               <div className='w-1/2 pt-12 overflow-hidden'>
                  <img
                     src={images.banner.parent}
                     alt=''
                     className='scale-125'
                  />
               </div>
               <div className='w-1/2 pt-10 overflow-hidden'>
                  <img src={images.banner.kids} alt='' className='scale-125' />
               </div>
            </div>
            <div className='relative border-t pt-7'>
               <h2 className='text-3xl font-semibold text-center text-[#383838] absolute -top-5 bg-white px-4 italic left-1/2 -translate-x-1/2'>
                  {t('home.trenyP')}
               </h2>
               <div className='flex justify-center mt-3 mb-12 space-x-12 text-lg font-medium text-[#383838]'>
                  <span
                     className={twMerge(
                        'cursor-pointer',
                        isTop && 'text-red-600 duration-150'
                     )}
                     onClick={() => setIsTop(true)}
                  >
                     {t('home.topP')}
                  </span>

                  <span
                     className={twMerge(
                        'cursor-pointer duration-150',
                        !isTop && 'text-red-600 '
                     )}
                     onClick={() => setIsTop(false)}
                  >
                     {/* {t('home.')} */}
                     Sale
                  </span>
               </div>
               {isLoading && (
                  <div className='flex justify-center'>
                     <Spin size='large' />
                  </div>
               )}
               {data && (
                  <Row gutter={[8, 24]}>
                     {data.products.map((item) => (
                        <Col
                           style={{
                              flexBasis: '20%',
                              width: '20%',
                           }}
                           key={item._id}
                        >
                           <ProductCard data={item} />
                        </Col>
                     ))}
                  </Row>
               )}
            </div>
         </div>
      </>
   );
};

export default Home;
