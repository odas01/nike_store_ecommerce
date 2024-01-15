import { cartApi, productApi, ratingApi } from '@/api';
import { twMerge } from 'tailwind-merge';
import { useTranslation } from 'react-i18next';
import { useMutation, useQueries, useQuery } from '@tanstack/react-query';
import React, { useRef, useState } from 'react';
import { Col, Row, Skeleton, Spin } from 'antd';
import { Swiper, SwiperClass, SwiperSlide } from 'swiper/react';
import {
   Link,
   Navigate,
   useLocation,
   useNavigate,
   useParams,
} from 'react-router-dom';

import {
   Autoplay,
   FreeMode,
   Thumbs,
   Scrollbar,
   Pagination,
} from 'swiper/modules';

import {
   AiFillStar,
   AiOutlineMinus,
   AiOutlinePlus,
   AiOutlineStar,
} from 'react-icons/ai';

import 'swiper/css/pagination';
import 'swiper/css/navigation';

import Rating from './Rating';
import ProductCard from '@/layouts/home/components/ProductCard';

import { notify, priceFormat } from '@/helpers';
import authStore from '@/stores/authStore';
import cartStore from '@/stores/cartStore';
import { CartItemUpLoad } from '@/types';
import { LoadingOverlay, PageTitle } from '@/components';

const Detail = () => {
   const params = useParams();
   const [num, setNum] = useState<number>(0);
   const slug = params.slug;
   const [size, setSize] = useState<string | null>(null);
   const [qty, setQty] = useState<number>(1);
   const [stock, setStock] = useState<number | null>(null);
   const [error, setError] = useState<boolean | null>(null);

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
   const [
      { data: similarProduct, isLoading: loading2 },
      { data: avgRating, isLoading: loading3 },
   ] = useQueries({
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

   const { t, i18n } = useTranslation(['home', 'mutual']);
   const isVnLang = i18n.language === 'vi';
   const navigate = useNavigate();
   const { currentUser, setPreviousLocation } = authStore();
   const { getCart } = cartStore();
   const { pathname } = useLocation();

   const swiperRef = useRef<SwiperClass>();

   const choseSize = (option: any) => {
      setSize(option.size);
      setStock(option.stock);
      if (error) setError(false);
   };
   const handleChangeQty = (e: React.FormEvent<HTMLInputElement>) => {
      if (size) {
         const value = Number(e.currentTarget.value);

         if (stock && value > stock) setQty(stock);
         else if (value < 1) setQty(1);
         else setQty(value);
      }
   };

   const addToCart = async (path: string) => {
      if (!currentUser) {
         setPreviousLocation(pathname);
         navigate('/login');
      } else {
         if (!size) {
            setError(true);
         } else if (!currentUser?._id) {
            navigate('/login');
         } else if (detail) {
            const values = {
               product: detail._id,
               variant: detail.variants[num]._id as string,
               size: size,
               qty,
            };
            addItemMutation.mutate({
               data: values,
               path,
            });
         }
      }
   };
   const addItemMutation = useMutation({
      mutationFn: ({ data }: { data: CartItemUpLoad; path: string }) =>
         cartApi.addItem(data),
      onSuccess: async ({ message }) => {
         await getCart();
         navigate(`/${addItemMutation.variables?.path}`);
         notify('success', isVnLang ? message.vi : message.en);
      },
      onError: ({ message }) => {
         notify('error', isVnLang ? message.vi : message.en);
      },
   });

   if (isError) {
      return <Navigate to='/404' />;
   }

   return (
      <>
         {!loading1 && <PageTitle title={detail.name} />}
         {addItemMutation.isLoading && <LoadingOverlay />}
         <div className='bg-[#f5f5f5] py-2 text-13'>
            <div className='container space-x-2'>
               <Link to='/'>{t('home.home')}</Link>
               <span className='text-[#ccc]'>/</span>
               <span className='capitalize text-[#777]'>{detail?.name}</span>
            </div>
         </div>
         <div className='container mt-6 space-y-20'>
            <div className='mt-2'>
               <Row gutter={24}>
                  <Col span={16}>
                     <Row gutter={[12, 16]} justify='center'>
                        <Col span={12}>
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
                        <Col span={12}>
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
                  <Col span={8}>
                     <Skeleton loading={loading1} active />
                     {detail && (
                        <div className='px-5 flex-column'>
                           <h1 className='text-4xl capitalize'>
                              {detail.name}
                           </h1>

                           <span className='text-base capitalize'>
                              {isVnLang
                                 ? detail.category.vnName
                                 : detail.category.name}
                           </span>
                           <div className='flex items-center py-2 mt-1 space-x-2 font-medium'>
                              <div className='flex items-center space-x-1'>
                                 <span className='text-yellow-500 text-15'>
                                    {avgRating?.avg}
                                 </span>
                                 <AiFillStar color='#F8DE22' size={20} />
                              </div>
                              <div className='flex items-center space-x-1 italic'>
                                 ({`${t('sold')}: ${detail.sold}`})
                              </div>
                           </div>
                           <div className='flex items-center mt-2 space-x-2'>
                              <span className='text-2xl font-medium text-red-500'>
                                 {priceFormat(detail.prices.price, isVnLang)}
                              </span>
                              {detail.discount !== 0 && (
                                 <span className='line-through italic text-[#808081] text-base font-normal'>
                                    {priceFormat(
                                       detail.prices.originalPrice,
                                       isVnLang
                                    )}
                                 </span>
                              )}
                           </div>

                           <p className='mt-4 text-sm font-medium text-justify mt-3z line-clamp-5'>
                              {detail.desc}
                           </p>
                           <div className='flex flex-col w-1/2 mt-4 space-y-1'>
                              <span className='text-base font-medium'>
                                 {t('label.color', { ns: 'mutual' })}
                              </span>
                              <Row gutter={[18, 6]}>
                                 {detail.variants.map((item, index) => (
                                    <Col
                                       key={index}
                                       span={8}
                                       className='flex flex-col items-center space-y-1'
                                    >
                                       <div
                                          className='w-8 rounded-full cursor-pointer aspect-square'
                                          style={{
                                             backgroundColor: item.color.value,
                                          }}
                                          onClick={() => {
                                             setNum(index);
                                             setSize(null);
                                             setQty(1);
                                          }}
                                       />
                                       {/* <img
                                          src={item.thumbnail.url}
                                          alt=''
                                          className={twMerge(
                                             'aspect-square object-top rounded cursor-pointer border border-transparent',
                                             num === index && 'border-[#111111]'
                                          )}
                                       /> */}
                                       <span className='font-semibold uppercase text-10 line-clamp-1'>
                                          {isVnLang
                                             ? item.color.vnName
                                             : item.color.name}
                                       </span>
                                    </Col>
                                 ))}
                              </Row>
                           </div>
                           <div className='flex flex-col mt-4 space-y-1'>
                              <span className='text-base font-medium'>
                                 {t('label.size', { ns: 'mutual' })}
                              </span>
                              <div className='flex-1 space-x-2'>
                                 <div className='mb-2'>
                                    <Row gutter={[6, 6]}>
                                       {detail.variants[num].sizes.map(
                                          (item, index) => (
                                             <Col span={4} key={index}>
                                                <div
                                                   className={twMerge(
                                                      'w-full py-2 flex justify-center items-center shadow-db text-xs text-center rounded-md cursor-pointer uppercase',
                                                      item.size === size &&
                                                         ' bg-[#FC6E20] text-white border-[#FC6E20]',
                                                      item.stock === 0
                                                         ? 'text-[#ddd] bg-[#f7f7f7] cursor-default'
                                                         : 'duration-150 hover:bg-[#FC6E20] hover:text-white hover:border-[#FC6E20]'
                                                   )}
                                                   onClick={() =>
                                                      item.stock !== 0 &&
                                                      choseSize(item)
                                                   }
                                                >
                                                   {item.size}
                                                </div>
                                             </Col>
                                          )
                                       )}
                                    </Row>
                                 </div>
                                 <div className='h-5 italic'>
                                    <span
                                       className={twMerge(
                                          'text-red-600',
                                          !error ? 'hidden' : 'block'
                                       )}
                                    >
                                       Please select size
                                    </span>
                                 </div>
                              </div>
                           </div>
                           <div className='mt-2 space-y-1'>
                              <span className='text-base font-medium'>
                                 {t('label.quantity', { ns: 'mutual' })}
                              </span>
                              <div className='flex items-center space-x-6'>
                                 <div className='flex items-center justify-between'>
                                    <button
                                       className='flex items-center justify-center w-10 text-sm rounded-full aspect-square shadow-db'
                                       onClick={() => {
                                          if (!size) setError(true);
                                          else if (qty > 1)
                                             setQty((qty) => qty - 1);
                                       }}
                                    >
                                       <AiOutlineMinus size={16} />
                                    </button>
                                    <input
                                       type='number'
                                       value={qty}
                                       className='w-20 text-base font-medium text-center'
                                       onChange={handleChangeQty}
                                    />
                                    <button
                                       className='flex items-center justify-center w-10 text-sm rounded-full aspect-square shadow-db'
                                       onClick={() => {
                                          if (!size) setError(true);
                                          else if (stock && qty < stock)
                                             setQty((qty) => qty + 1);
                                       }}
                                    >
                                       <AiOutlinePlus size={16} />
                                    </button>
                                 </div>

                                 {stock && (
                                    <div className='text-xs text-[#ED9857] font-semibold'>
                                       {t('onlyItemDetail', {
                                          count: stock,
                                       })}
                                       <br />
                                    </div>
                                 )}
                              </div>
                           </div>
                           <div className='flex mt-6 h-14 gap-x-4'>
                              <div className='flex-1 rounded-lg flex-center bg-[#3085C3] text-white duration-200 hover:-translate-y-1 hover:shadow-[0_8px_8px_-6px_#3085C3]'>
                                 <button
                                    className='w-full h-full text-base font-bold cursor-pointer text-inherit'
                                    onClick={() => addToCart('cart')}
                                 >
                                    {t('action.addToCart', { ns: 'mutual' })}
                                 </button>
                              </div>
                              <div className='flex-1 rounded-lg flex-center text-[#3085C3] border-[3px] border-current duration-200 hover:-translate-y-1 hover:shadow-[0_8px_8px_-6px_currentcolor]'>
                                 <button
                                    className='w-full h-full text-base font-bold cursor-pointer text-inherit'
                                    onClick={() => addToCart('checkout')}
                                 >
                                    {t('action.buyNow', { ns: 'mutual' })}
                                 </button>
                              </div>
                           </div>
                        </div>
                     )}
                  </Col>
               </Row>
            </div>
            {detail && <Rating productId={detail._id} />}

            {loading2 ? (
               <div className='flex justify-center'>
                  <Spin size='large' />
               </div>
            ) : (
               <div className='space-y-3'>
                  <h2 className='text-2xl font-medium'>{t('home.uLike')}</h2>
                  <Swiper
                     spaceBetween={8}
                     slidesPerView={4}
                     modules={[Scrollbar]}
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
      </>
   );
};

export default Detail;
