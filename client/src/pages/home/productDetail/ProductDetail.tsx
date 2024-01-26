import { useRef, useState } from 'react';
import { Col, Row, Skeleton, Spin } from 'antd';
import { productApi, ratingApi } from '@/api';
import { useTranslation } from 'react-i18next';
import { useQueries, useQuery } from '@tanstack/react-query';
import { Link, Navigate, useParams } from 'react-router-dom';
import { Swiper, SwiperClass, SwiperSlide } from 'swiper/react';
import {
   Autoplay,
   FreeMode,
   Thumbs,
   Scrollbar,
   Pagination,
} from 'swiper/modules';

import 'swiper/css/pagination';
import 'swiper/css/navigation';

import { PageTitle, ProductCard } from '@/components';
import Rating from './components/Rating';
import Detail from './components/Detail';

const ProductDetail = () => {
   const params = useParams();
   const [num, setNum] = useState<number>(0);
   const slug = params.slug;
   const [thumbsSwiper, setThumbsSwiper] = useState<SwiperClass>();
   const {
      data: detail,
      isLoading: loading1,
      isError,
   } = useQuery({
      queryKey: ['product', slug],
      queryFn: () => productApi.get(slug!, { status: 'show' }),
      enabled: !!slug,
   });

   const categoryId = detail?.category;
   const [{ data: similarProduct, isLoading: loading2 }, { data: avgRating }] =
      useQueries({
         queries: [
            {
               queryKey: ['product', categoryId],
               queryFn: () =>
                  productApi.similar(slug!, {
                     skip: 0,
                     limit: 15,
                     category: categoryId,
                  }),
               enabled: !!categoryId && !!slug,
            },
            {
               queryKey: ['avgRating'],
               queryFn: () => ratingApi.avg(detail?._id!),
               enabled: !!detail?._id,
            },
         ],
      });

   const { t } = useTranslation(['home', 'mutual']);

   const swiperRef = useRef<SwiperClass>();

   if (isError) {
      return <Navigate to='/404' />;
   }

   return (
      <>
         {!loading1 && <PageTitle title={detail.name} />}
         <div className='bg-[#f5f5f5] py-2 text-13'>
            <div className='container space-x-2'>
               <Link to='/'>{t('home.home')}</Link>
               <span className='text-[#ccc]'>/</span>
               <span className='capitalize text-[#777]'>{detail?.name}</span>
            </div>
         </div>
         <div className='container space-y-20'>
            <div className='-mx-2 md:px-0'>
               <Row
                  gutter={[
                     { xs: 0, xl: 24 },
                     { xs: 0, xl: 24 },
                  ]}
                  className='pt-4 xl:pt-0'
               >
                  <Col xl={16} md={12} xs={0}>
                     <Row gutter={[12, 16]} justify='center'>
                        <Col xl={12} md={0}>
                           <div className='w-full aspect-product'>
                              {!loading1 ? (
                                 <img
                                    src={detail?.variants[num].thumbnail.url}
                                    className='rounded'
                                    alt='thumbnail'
                                 />
                              ) : (
                                 <Skeleton.Image
                                    className='!w-full !h-full'
                                    active
                                 />
                              )}
                           </div>
                        </Col>
                        <Col xl={12} md={24}>
                           <div className='w-full aspect-product'>
                              {!loading1 ? (
                                 <Swiper
                                    onBeforeInit={(swiper) => {
                                       swiperRef.current = swiper;
                                    }}
                                    thumbs={{ swiper: thumbsSwiper }}
                                    spaceBetween={4}
                                    autoplay={{
                                       delay: 2000,
                                       disableOnInteraction: false,
                                    }}
                                    loop={true}
                                    pagination={{
                                       dynamicBullets: true,
                                    }}
                                    modules={[
                                       FreeMode,
                                       Thumbs,
                                       Autoplay,
                                       Pagination,
                                    ]}
                                    className='relative h-full overflow-hidden rounded'
                                 >
                                    <SwiperSlide className='xl:hidden'>
                                       <img
                                          src={
                                             detail?.variants[num].thumbnail.url
                                          }
                                          alt={`slide 0`}
                                       />
                                    </SwiperSlide>
                                    {detail?.variants[num].images.map(
                                       (item, index) => (
                                          <SwiperSlide key={index} className=''>
                                             <img
                                                src={item.url}
                                                className='object-contain rounded cursor-pointer'
                                                alt={`slide ${index}`}
                                             />
                                          </SwiperSlide>
                                       )
                                    )}
                                 </Swiper>
                              ) : (
                                 <Skeleton.Image
                                    active
                                    className='!w-full !h-full'
                                 />
                              )}
                           </div>
                        </Col>
                        <Col span={12} className='flex justify-center'>
                           <div className='w-3/4 h-1/2'>
                              {!loading1 ? (
                                 <Swiper
                                    onSwiper={setThumbsSwiper}
                                    slidesPerView={4}
                                    spaceBetween={12}
                                    loop={true}
                                    freeMode={true}
                                    watchSlidesProgress={true}
                                    modules={[FreeMode, Thumbs]}
                                    className='h-full mySwiper'
                                 >
                                    {detail?.variants[num].images.map(
                                       (item, index) => (
                                          <SwiperSlide key={index}>
                                             <img
                                                src={item.url}
                                                alt={`slide ${index}`}
                                                className='rounded cursor-pointer'
                                             />
                                          </SwiperSlide>
                                       )
                                    )}
                                 </Swiper>
                              ) : (
                                 <Skeleton.Input
                                    className='!w-full !h-11'
                                    active
                                 />
                              )}
                           </div>
                        </Col>
                     </Row>
                  </Col>
                  <Col xl={8} md={12} xs={24}>
                     <Skeleton loading={loading1} active />
                     {detail && (
                        <Detail
                           {...{
                              detail,
                              num,
                              setNum,
                           }}
                           avgRating={avgRating?.avg!}
                        />
                     )}
                  </Col>
               </Row>

               {detail && <Rating productId={detail._id} />}

               {loading2 ? (
                  <div className='flex justify-center'>
                     <Spin size='large' />
                  </div>
               ) : (
                  <div className='px-3 space-y-3 xl:px-0'>
                     <h2 className='text-lg font-medium xl:text-2xl'>
                        {t('home.uLike')}
                     </h2>
                     <Swiper
                        spaceBetween={8}
                        slidesPerView={2}
                        modules={[Scrollbar]}
                        breakpoints={{
                           768: {
                              slidesPerView: 4,
                           },
                        }}
                     >
                        {similarProduct?.products.map((item, index) => (
                           <SwiperSlide key={index}>
                              <ProductCard data={item} />
                           </SwiperSlide>
                        ))}
                     </Swiper>
                  </div>
               )}
            </div>
         </div>
      </>
   );
};

export default ProductDetail;
