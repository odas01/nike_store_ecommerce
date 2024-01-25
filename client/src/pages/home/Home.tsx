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
import ProductCard from '@/components/ProductCard';

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
         <div className='relative xl:h-screen md:h-[75vh] h-[50vh] bg-banner bg-repeat bg-fixed'>
            <img
               src={images.bannerr}
               alt=''
               className='xl:w-[580px] md:w-64 w-40 absolute xl:right-28 right-2 object-contain'
            />

            <div className='absolute text-white w-min md:w-fit flex-column bottom-4 left-4 xl:top-1/3 xl:left-28'>
               <span className='font-nikeFutura tracking-[8px] md:text-8xl text-3xl overflow-hidden whitespace-nowrap animate-typing'>
                  JUST DO IT
               </span>
               <span className='mt-2 text-2xl italic md:text-3xl font-nikeFutura'>
                  Play With Electric Nike Shoes
               </span>
               <Link
                  to='/shop'
                  className='relative px-3 py-2 mt-16 text-black bg-white rounded-full cursor-pointer md:mt-24 md:px-5 md:py-3 flex-center w-fit group'
               >
                  <span className='z-10 mr-4 font-medium duration-300 text-13 md:text-lg group-hover:text-white'>
                     {t('cart.startShopping')}
                  </span>
                  <div className='z-10 p-1 rounded-full md:p-2 flex-center'>
                     <BsArrowRight color='#fff' />
                  </div>
                  <div className='absolute right-[10px] md:w-10 w-8 aspect-square bg-[#181823] rounded-full duration-300 group-hover:w-[102%] group-hover:h-[102%] group-hover:right-[-1px]' />
               </Link>
            </div>
         </div>

         <div className='container py-4 space-y-6 xl:py-10 md:space-y-16'>
            <div className='space-y-3'>
               <h2 className='text-lg font-medium xl:text-2xl md:text-xl'>
                  {t('home.bestSeller')}
               </h2>
               <Swiper
                  spaceBetween={8}
                  slidesPerView={2}
                  breakpoints={{
                     768: {
                        slidesPerView: 3,
                     },
                     1280: {
                        slidesPerView: 5,
                     },
                  }}
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
               <h1 className='text-3xl uppercase xl:text-5xl md:text-4xl font-nikeFutura'>
                  Just do it
               </h1>
               <Link
                  to='shop'
                  className='md:mt-4 mt-1 bg-[#181823] text-white inline-block px-5 py-2 rounded-full 
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
               <h2 className='xl:text-5xl md:text-3xl w-max text-2xl font-semibold text-center text-[#383838] absolute md:-top-5 -top-3 bg-white px-4 italic left-1/2 -translate-x-1/2'>
                  {t('home.trenyP')}
               </h2>
               <div className='flex justify-center xl:mt-3 xl:mb-12 mb-8 space-x-12 xl:text-lg font-medium text-[#383838]'>
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
                        <Col key={item._id} xs={{ span: 12 }} lg={{ span: 6 }}>
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
