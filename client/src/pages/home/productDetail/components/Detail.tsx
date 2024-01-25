import { cartApi } from '@/api';
import { LoadingOverlay } from '@/components';
import { notify, priceFormat } from '@/helpers';
import authStore from '@/stores/authStore';
import cartStore from '@/stores/cartStore';
import { CartItemUpLoad, IProduct } from '@/types';
import { useMutation } from '@tanstack/react-query';
import { Col, Row } from 'antd';
import React, { Dispatch, SetStateAction, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AiFillStar, AiOutlineMinus, AiOutlinePlus } from 'react-icons/ai';
import { useLocation, useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { twMerge } from 'tailwind-merge';

interface IDetailProps {
   detail: IProduct;
   avgRating: number | 0;
   num: number;
   setNum: Dispatch<SetStateAction<number>>;
}

const Detail: React.FC<IDetailProps> = ({ detail, avgRating, num, setNum }) => {
   const { t, i18n } = useTranslation(['home', 'mutual']);
   const isVnLang = i18n.language === 'vi';
   const [size, setSize] = useState<string | null>(null);
   const [qty, setQty] = useState<number>(1);

   const { currentUser, setPreviousLocation } = authStore();
   const { pathname } = useLocation();
   const [stock, setStock] = useState<number | null>(null);
   const [error, setError] = useState<boolean | null>(null);
   const navigate = useNavigate();
   const { getCart } = cartStore();

   const handleChangeColor = (index: number) => {
      setNum(index);
      setSize(null);
      setQty(1);
   };
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

   return (
      <>
         <LoadingOverlay show={addItemMutation.isLoading} />

         <div className='px-4'>
            <h1 className='text-xl font-medium capitalize xl:text-4xl md:text-2xl'>
               {detail.name}
            </h1>

            <span className='capitalize md:text-sm'>
               {isVnLang ? detail.category.vnName : detail.category.name}
            </span>
            <div className='flex items-center py-2 mt-1 space-x-2 font-medium text-13 xl:text-sm'>
               <div className='flex items-center space-x-1'>
                  <span className='text-yellow-500 text-15'>{avgRating}</span>
                  <AiFillStar color='#F8DE22' size={20} />
               </div>
               <div className='flex items-center space-x-1 italic'>
                  ({`${t('sold')}: ${detail.sold}`})
               </div>
            </div>
            <div className='flex items-center mt-2 space-x-2'>
               <span className='text-xl font-medium text-red-500 xl:text-2xl'>
                  {priceFormat(detail.prices.price, isVnLang)}
               </span>
               {detail.discount !== 0 && (
                  <span className='line-through italic text-[#808081] text-base font-normal'>
                     {priceFormat(detail.prices.originalPrice, isVnLang)}
                  </span>
               )}
            </div>
         </div>

         <div className='mt-4 md:hidden'>
            <Swiper
               slidesPerView={1}
               breakpoints={{
                  768: {
                     slidesPerView: 2,
                  },
               }}
               loop={true}
               className='h-full mySwiper'
            >
               <SwiperSlide>
                  <img
                     src={detail?.variants[num].thumbnail.url}
                     alt={`slide 0`}
                  />
               </SwiperSlide>
               {detail?.variants[num].images.map((item, index) => (
                  <SwiperSlide key={index}>
                     <img src={item.url} alt={`slide ${index + 1}`} />
                  </SwiperSlide>
               ))}
            </Swiper>
         </div>

         <div className='px-4'>
            <p className='mt-4 font-medium text-justify text-13 xl:text-sm line-clamp-5'>
               {detail.desc}
            </p>
            <div className='flex flex-col w-1/2 mt-4 space-y-1'>
               <span className='font-medium text-13 xl:text-base'>
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
                           onClick={() => handleChangeColor(index)}
                        />
                        <span className='font-semibold uppercase text-10 line-clamp-1'>
                           {isVnLang ? item.color.vnName : item.color.name}
                        </span>
                     </Col>
                  ))}
               </Row>
            </div>
            <div className='flex flex-col mt-4 space-y-1'>
               <span className='font-medium text-13 xl:text-base'>
                  {t('label.size', { ns: 'mutual' })}
               </span>
               <div className='flex-1 space-x-2'>
                  <div className='mb-2'>
                     <Row gutter={[6, 6]}>
                        {detail.variants[num].sizes.map((item, index) => (
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
                                    item.stock !== 0 && choseSize(item)
                                 }
                              >
                                 {item.size}
                              </div>
                           </Col>
                        ))}
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
               <span className='font-medium text-13 xl:text-base'>
                  {t('label.quantity', { ns: 'mutual' })}
               </span>
               <div className='flex items-center space-x-6'>
                  <div className='flex items-center justify-between'>
                     <button
                        className='flex items-center justify-center w-10 rounded-full aspect-square shadow-db'
                        onClick={() => {
                           if (!size) setError(true);
                           else if (qty > 1) setQty((qty) => qty - 1);
                        }}
                     >
                        <AiOutlineMinus size={16} />
                     </button>
                     <input
                        type='number'
                        value={qty}
                        className='w-20 text-sm font-medium text-center xl:text-base'
                        onChange={handleChangeQty}
                     />
                     <button
                        className='flex items-center justify-center w-10 rounded-full aspect-square shadow-db'
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
      </>
   );
};

export default Detail;
