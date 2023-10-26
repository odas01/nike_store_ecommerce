import { productApi } from '@/api';
import images from '@/assets/images';
import { Paypal } from '@/components';
import ProductCard from '@/layouts/home/components/ProductCard';
import ProductList from '@/layouts/home/components/ProductList';
import { useQueries, useQuery } from '@tanstack/react-query';
import { Col, Row, Spin } from 'antd';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BsArrowRight } from 'react-icons/bs';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { twMerge } from 'tailwind-merge';
import 'swiper/css/scrollbar';
import { Scrollbar } from 'swiper/modules';

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
            status: 'show',
         }),
   });

   return (
      <>
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
                     Start Shopping
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
               <h2 className='text-2xl'>{t('home.bestSeller')}</h2>
               <Swiper
                  spaceBetween={8}
                  slidesPerView={5}
                  scrollbar={{
                     hide: false,
                  }}
                  modules={[Scrollbar]}
                  // scrollbar={{
                  //     hide: false
                  // }}
                  // modules={[Scrollbar]}
               >
                  {newProduct?.data?.products.map((item, index) => (
                     <SwiperSlide key={index}>
                        <ProductCard data={item} />
                     </SwiperSlide>
                  ))}
               </Swiper>
               {/* <Row gutter={12}>
                  {newProduct?.data?.products.map((item, index) => (
                     <Col key={index} span={4}>
                        <ProductCard data={item} size={14} />
                     </Col>
                  ))}
               </Row> */}
            </div>
            <div className='text-center'>
               <h1 className='text-5xl uppercase font-nikeFutura'>
                  Just do it
               </h1>
               <p className='text-base font-medium'>Free your sparkle</p>
               <Link
                  to='shop'
                  className='mt-4 bg-[#181823] text-white inline-block px-5 py-2 rounded-full 
                    cursor-pointer hover:opacity-80 hover:text-white'
               >
                  Shop now
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
            <div>
               <h2 className='text-3xl font-semibold text-center text-[#383838]'>
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
            <div className='flex items-center justify-between'>
               <div className='flex space-x-4'>
                  <img
                     src={images.slogan.shipping}
                     alt='slogan'
                     className='w-16'
                  />
                  <div className='flex flex-col justify-center space-y-1'>
                     <span className='text-lg font-semibold'>
                        Free shipping
                     </span>
                     <span className='text-sm font-medium text-[#5e5e5e]'>
                        Orders over 1000000đ
                     </span>
                  </div>
               </div>
               <div className='flex space-x-4'>
                  <img
                     src={images.slogan.return}
                     alt='slogan'
                     className='w-16'
                  />
                  <div className='flex flex-col justify-center space-y-1'>
                     <span className='text-lg font-semibold'>
                        5 days return
                     </span>
                     <span className='text-sm font-medium text-[#5e5e5e]'>
                        Not damaged
                     </span>
                  </div>
               </div>
               <div className='flex space-x-4'>
                  <img
                     src={images.slogan.support}
                     alt='slogan'
                     className='w-16'
                  />
                  <div className='flex flex-col justify-center space-y-1'>
                     <span className='text-lg font-semibold'>Support 24/7</span>
                     <span className='text-sm font-medium text-[#5e5e5e]'>
                        Quick support
                     </span>
                  </div>
               </div>
               <div className='flex space-x-4'>
                  <img
                     src={images.slogan.payment}
                     alt='slogan'
                     className='w-16'
                  />
                  <div className='flex flex-col justify-center space-y-1'>
                     <span className='text-lg font-semibold'>
                        Payment secure
                     </span>
                     <span className='text-sm font-medium text-[#5e5e5e]'>
                        100% payment secure
                     </span>
                  </div>
               </div>
            </div>
         </div>
      </>
   );
};

export default Home;
