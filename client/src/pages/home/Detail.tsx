import { productApi } from '@/api';
import { useQuery } from '@tanstack/react-query';
import { Breadcrumb, Col, Row, Skeleton } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { BiChevronLeft, BiChevronRight } from 'react-icons/bi';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Autoplay, FreeMode, Navigation, Thumbs } from 'swiper/modules';
import { Swiper, SwiperClass, SwiperSlide, useSwiper } from 'swiper/react';
import 'swiper/css/navigation';
import { priceFormat } from '@/helpers';
import { twMerge } from 'tailwind-merge';
import { AiOutlineMinus, AiOutlinePlus } from 'react-icons/ai';
import authStore from '@/stores/authStore';
import cartStore from '@/stores/cartStore';
import { useTranslation } from 'react-i18next';
import { BsStarFill } from 'react-icons/bs';
import Rating from './Rating';

const Detail = () => {
   const params = useParams();
   const [num, setNum] = useState<number>(0);
   const slug = String(params.slug);
   const [size, setSize] = useState<string | null>(null);
   const [qty, setQty] = useState<number>(1);
   const [stock, setStock] = useState<number | null>(null);
   const [error, setError] = useState<boolean | null>(null);

   const [thumbsSwiper, setThumbsSwiper] = useState<SwiperClass>();
   const { data, isLoading } = useQuery({
      queryKey: ['product', slug],
      queryFn: () => productApi.get(slug),
      staleTime: 60 * 1000,
   });
   const { t } = useTranslation(['home', 'mutual']);
   const navigate = useNavigate();
   const { currentUser } = authStore();
   const { addItem, getCart } = cartStore();
   //    console.log(1233);
   //       useEffect(() => {
   //         set
   //       }, [productColor]);

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

   const addToCart = async (path: 'checkout' | 'cart') => {
      if (!size) {
         setError(true);
      } else if (!currentUser?._id) {
         navigate('/login');
      } else if (data) {
         const values = {
            product: data._id,
            variant: data.variants[num]._id as string,
            size: size,
            qty,
         };
         await addItem(values);
         await getCart();

         // await createItem(data);
         // await getCart();
         // navigate('/' + path);
      }
   };

   return (
      <div className='container'>
         {/* {!isLoading ? (
            <Breadcrumb
               items={[
                  {
                     title: (
                        <Link to='/'>{t('navbar.home', { ns: 'home' })}</Link>
                     ),
                  },
                  {
                     title: (
                        <Link
                           to={`/shop/${data?.category.store}`}
                           className='capitalize'
                        >
                           {data?.category.store}
                        </Link>
                     ),
                  },
                  {
                     title: (
                        <Link
                           to={`/shop/${data?.category.store}/${data?.category.name}`}
                           className='capitalize'
                        >
                           {data?.category.name}
                        </Link>
                     ),
                  },
                  {
                     title: data?.name,
                  },
               ]}
            />
         ) : (
            <Skeleton paragraph={false} active className='w-96 mt-b' />
         )} */}

         {
            <div className='mt-2'>
               <Row gutter={24}>
                  <Col span={16}>
                     <Row gutter={[12, 16]} justify='center'>
                        <Col span={12}>
                           <div className='w-full aspect-product'>
                              {!isLoading ? (
                                 <img
                                    src={data?.variants[num].thumbnail.url}
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
                              {!isLoading ? (
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
                                    modules={[
                                       FreeMode,
                                       Thumbs,
                                       Autoplay,
                                       Navigation,
                                    ]}
                                    className='relative h-full overflow-hidden rounded'
                                 >
                                    {data?.variants[num].images.map(
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
                                    <div className='absolute z-40 flex justify-center space-x-3 bottom-1 right-1'>
                                       <div
                                          className='px-2 py-1 bg-white border hover:bg-[#ababab]  rounded-full cursor-pointer duration-150'
                                          onClick={() =>
                                             swiperRef.current?.slidePrev()
                                          }
                                       >
                                          <BiChevronLeft size={28} />
                                       </div>
                                       <div
                                          className='px-2 py-1 bg-white border hover:bg-[#ababab] duration-150 rounded-full cursor-pointer'
                                          onClick={() =>
                                             swiperRef.current?.slideNext()
                                          }
                                       >
                                          <BiChevronRight size={28} />
                                       </div>
                                    </div>
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
                              {!isLoading ? (
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
                                    {data?.variants[num].images.map(
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
                     <Skeleton loading={isLoading} active />
                     {data && (
                        <div className='px-5 flex-column'>
                           <h1 className='text-4xl capitalize'>{data.name}</h1>

                           <span className='text-base capitalize'>
                              {data.category.name} {data.category.store}
                           </span>
                           <div className='flex items-center justify-between py-2 mt-2 space-x-6 border-y'>
                              <span className='bg-[#EDEDED] text-red-500 px-3 py-1 rounded text-xs'>
                                 -{data.discount}%
                              </span>
                              <div className='flex items-center space-x-1'>
                                 <span className=''>{data.sold}</span>
                                 <span className='text-[#767676]'>
                                    {t('sold')}
                                 </span>
                              </div>
                           </div>
                           <div className='flex items-center mt-2 space-x-2'>
                              <span className='text-xl text-red-500 '>
                                 {priceFormat(data.prices.price)}
                              </span>
                              <span className='line-through italic text-[#808081] text-base font-normal'>
                                 {priceFormat(data.prices.originalPrice)}
                              </span>
                           </div>

                           <p className='mt-2 text-sm text-justify line-clamp-5'>
                              {data.desc}
                           </p>
                           <div className='flex flex-col w-1/2 mt-4 space-y-1'>
                              <span className='text-base'>
                                 {t('label.color', { ns: 'mutual' })}
                              </span>
                              <Row gutter={[6, 6]}>
                                 {data.variants.map((item, index) => (
                                    <Col
                                       key={index}
                                       span={6}
                                       onClick={() => {
                                          setNum(index);
                                          setSize(null);
                                          setQty(1);
                                       }}
                                       className='flex flex-col items-center space-y-1'
                                    >
                                       <img
                                          src={item.thumbnail.url}
                                          alt=''
                                          className={twMerge(
                                             'aspect-square object-top rounded cursor-pointer border border-transparent',
                                             num === index && 'border-[#111111]'
                                          )}
                                       />
                                       <span className='text-[10px] font-semibold uppercase'>
                                          {item.color.name}
                                       </span>
                                    </Col>
                                 ))}
                              </Row>
                           </div>
                           <div className='flex flex-col mt-4 space-y-1'>
                              <span className='text-base'>
                                 {t('label.size', { ns: 'mutual' })}
                              </span>
                              <div className='flex-1 space-x-2'>
                                 <div className='mb-2'>
                                    <Row gutter={[6, 6]}>
                                       {data.variants[num].sizes.map(
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
                              <span className='text-base'>
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
                                    <div className='text-xs'>
                                       Only{' '}
                                       <span className='text-[#ED9857] font-semibold'>
                                          {stock} item
                                       </span>
                                       ! <br />
                                       Don't miss it
                                    </div>
                                 )}
                              </div>
                           </div>
                           <div className='flex mt-6 h-14 gap-x-4'>
                              <div className='flex-1 rounded-lg flex-center bg-[#3085C3] text-white duration-200 hover:-translate-y-1 hover:shadow-[0_8px_8px_-6px_#3085C3]'>
                                 <button
                                    className='w-full h-full text-base font-bold cursor-pointer text-inherit'
                                    onClick={() => addToCart('checkout')}
                                 >
                                    {t('action.addToCart', { ns: 'mutual' })}
                                 </button>
                              </div>
                              <div className='flex-1 rounded-lg flex-center text-[#3085C3] border-[3px] border-current duration-200 hover:-translate-y-1 hover:shadow-[0_8px_8px_-6px_currentcolor]'>
                                 <button
                                    className='w-full h-full text-base font-bold cursor-pointer text-inherit'
                                    onClick={() => addToCart('cart')}
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
         }
         {data && (
            <div className='mt-8'>
               <Rating productId={data._id} />
            </div>
         )}
      </div>
   );
};

export default Detail;
