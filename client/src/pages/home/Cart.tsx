import { twMerge } from 'tailwind-merge';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Checkbox, Col, Modal, Row } from 'antd';
import { useMutation } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { CheckboxChangeEvent } from 'antd/es/checkbox';

import { RiDeleteBin5Line } from 'react-icons/ri';
import { AiOutlineMinus, AiOutlinePlus } from 'react-icons/ai';

import { BreadCrumb, Button, PageTitle } from '@/components';

import { cartApi } from '@/api';
import images from '@/assets/images';
import cartStore from '@/stores/cartStore';
import { notify, priceFormat } from '@/helpers';
import { CartItemUpdate, ICartItem } from '@/types';

const Cart = () => {
   const { t, i18n } = useTranslation(['home', 'mutual']);
   const isVnLang = i18n.language === 'vi';

   const navigate = useNavigate();
   const { qty, cart, updateCart, getCart, subTotal } = cartStore();

   const [isCheck, setIsCheck] = useState<string[]>([]);
   const [isCheckAll, setIsCheckAll] = useState<boolean>(false);
   const [openModal, setOpenModal] = useState<boolean>(false);

   const changeQty = async (item: ICartItem, type?: 'plus' | 'minus') => {
      let qty = item.qty;
      if (type === 'plus') {
         qty += 1;
      } else if (type === 'minus') {
         qty -= 1;
      } else {
         qty;
      }
      updateItemMutation.mutate({
         id: item._id,
         data: {
            variant: item.variant._id!,
            size: item.size,
            qty,
         },
      });
   };

   const updateItemMutation = useMutation({
      mutationFn: ({ id, data }: { id: string; data: CartItemUpdate }) =>
         cartApi.updateItem(id, data),
      onSuccess: (data) => {
         updateCart(data._id, data);
      },

      onError: ({ message }) => {
         notify('error', isVnLang ? message.vi : message.en);
      },
   });

   const deleteItemMutation = useMutation({
      mutationFn: (listId: string[]) => cartApi.deleteItems(listId),
      onSuccess: () => {
         getCart();
      },

      onError: ({ message }) => {
         notify('error', isVnLang ? message.vi : message.en);
      },
   });

   useEffect(() => {
      if (isCheck.length === cart.length) {
         !isCheckAll && setIsCheckAll(true);
      } else {
         isCheckAll && setIsCheckAll(false);
      }
   }, [isCheck]);
   const handleCheck = (e: CheckboxChangeEvent, id: string) => {
      const { checked } = e.target;
      if (!checked) {
         setIsCheck(isCheck.filter((item) => item !== id));
      } else {
         setIsCheck((state) => [...state, id]);
      }
   };
   const handleCheckAll = () => {
      setIsCheckAll(!isCheckAll);
      setIsCheck(cart.map((li) => li._id));
      if (isCheckAll) {
         setIsCheck([]);
      }
   };

   const originTotal = cart.reduce((cur, item) => {
      if (item.product) {
         return cur + item.qty * item.product.prices.originalPrice;
      }
      return cur;
   }, 0);

   return (
      <>
         <PageTitle title='Cart' />
         <BreadCrumb
            className='mobile:hidden'
            items={[
               {
                  title: t('home.home'),
               },
               {
                  title: t('cart.cart'),
               },
            ]}
         />
         <div className='space-y-6 mobile:pt-4 mobile:px-2'>
            <div>
               <h2 className='text-lg font-medium text-center md:text-xl xl:text-3xl mobile:uppercase'>
                  {t('cart.yourCart')}
               </h2>
               <div className='w-16 h-1 mx-auto mt-2 bg-black xl:mt-6' />
               {qty > 0 ? (
                  <>
                     <div className='hidden pb-2 mt-8 border-b border-gray-400 md:block'>
                        <Row className='font-semibold'>
                           <Col xl={1} md={0}>
                              <Checkbox
                                 onChange={handleCheckAll}
                                 checked={isCheckAll}
                              />
                           </Col>
                           <Col xl={8} md={11}>
                              <span>{t('cart.productName')}</span>
                           </Col>
                           <Col xl={3} md={0} className='text-center'>
                              <span>{t('cart.variations')}</span>
                           </Col>
                           <Col xl={4} md={4} className='text-center'>
                              <span>{t('cart.unitPrice')}</span>
                           </Col>
                           <Col xl={3} md={4} className='text-center'>
                              <span>
                                 {t('label.quantity', { ns: 'mutual' })}
                              </span>
                           </Col>
                           <Col xl={4} md={4} className='text-center'>
                              <span>{t('cart.totalPrice')}</span>
                           </Col>
                        </Row>
                     </div>

                     <div className='mobile:mt-2'>
                        {cart
                           .filter((item) => item.product)
                           .map((item, index) => (
                              <div
                                 className={twMerge(
                                    'py-4 border-b border-gray-300 mobile:px-2',
                                    deleteItemMutation.isLoading &&
                                       deleteItemMutation.variables?.includes(
                                          item._id
                                       ) &&
                                       'pointer-events-none opacity-60'
                                 )}
                                 key={index}
                              >
                                 <Row gutter={[0, { xs: 8 }]}>
                                    <Col xl={1} xs={0}>
                                       <div className='flex items-center'>
                                          <Checkbox
                                             onChange={(e) =>
                                                handleCheck(e, item._id)
                                             }
                                             checked={isCheck.includes(
                                                item._id
                                             )}
                                          />
                                       </div>
                                    </Col>
                                    <Col xl={8} md={11} xs={24}>
                                       <Link
                                          to={'/d/' + item.product.slug}
                                          className='flex pr-2 xl:pr-6 hover:text-inherit'
                                       >
                                          <div className='overflow-hidden rounded w-14 xl:w-20 md:w-12 aspect-square'>
                                             <img
                                                src={item.variant.thumbnail.url}
                                                className=''
                                                alt={item.product.name}
                                             />
                                          </div>
                                          <div className='flex-1 pl-4 xl:pt-2 mobile:pr-4 mobile:flex mobile:flex-col mobile:justify-center'>
                                             <span className='font-medium text-13 xl:text-base md:text-15 line-clamp-1'>
                                                {item.product.name}
                                             </span>
                                             <div className='flex items-center text-xs xl:text-base'>
                                                <span className='capitalize'>
                                                   {item.variant.color.name}
                                                </span>
                                                <span className='mx-2'>/</span>
                                                <span className='uppercase'>
                                                   {item.size}
                                                </span>
                                             </div>
                                          </div>
                                          <button
                                             className='cursor-pointer flex-center md:hidden'
                                             onClick={() =>
                                                deleteItemMutation.mutate([
                                                   item._id,
                                                ])
                                             }
                                          >
                                             <RiDeleteBin5Line size={18} />
                                          </button>
                                       </Link>
                                    </Col>
                                    <Col xl={3} md={0} xs={0}>
                                       <div className='flex flex-col items-center justify-center h-full text-13'>
                                          <div className='flex items-center'>
                                             <span className='capitalize'>
                                                {item.variant.color.name}
                                             </span>
                                             <span className='mx-2'>/</span>
                                             <span className='uppercase '>
                                                {item.size}
                                             </span>
                                          </div>
                                       </div>
                                    </Col>
                                    <Col
                                       xl={4}
                                       md={4}
                                       xs={8}
                                       className='flex flex-col items-center justify-center'
                                    >
                                       {item.product.discount !== 0 && (
                                          <p className='line-through italic text-[rgba(0,0,0,0.5)]'>
                                             {priceFormat(
                                                item.product.prices
                                                   .originalPrice,
                                                isVnLang
                                             )}
                                          </p>
                                       )}
                                       <p className='text-sm xl:text-base'>
                                          {priceFormat(
                                             item.product.prices.price,
                                             isVnLang
                                          )}
                                       </p>
                                    </Col>
                                    <Col
                                       xl={3}
                                       md={4}
                                       xs={8}
                                       className='flex items-center justify-center'
                                    >
                                       <div
                                          className={twMerge(
                                             'flex items-center justify-center select-none',
                                             updateItemMutation.isLoading &&
                                                updateItemMutation.variables
                                                   ?.id === item._id &&
                                                'pointer-events-none opacity-60'
                                          )}
                                       >
                                          <button
                                             className={twMerge(
                                                'flex items-center justify-center xl:w-10 w-8 text-sm rounded-full aspect-square shadow-db',
                                                item.qty === 1 &&
                                                   'opacity-60 pointer-events-none cursor-not-allowed'
                                             )}
                                             onClick={() =>
                                                item.qty > 1 &&
                                                changeQty(item, 'minus')
                                             }
                                          >
                                             <AiOutlineMinus size={16} />
                                          </button>
                                          <input
                                             type='number'
                                             value={item.qty}
                                             className='w-12 font-medium text-center xl:text-base text-15 xl:w-14'
                                             readOnly
                                          />
                                          <button
                                             className='flex items-center justify-center w-8 text-sm rounded-full xl:w-10 aspect-square shadow-db'
                                             onClick={() =>
                                                changeQty(item, 'plus')
                                             }
                                          >
                                             <AiOutlinePlus size={16} />
                                          </button>
                                       </div>
                                    </Col>
                                    <Col
                                       xl={4}
                                       md={4}
                                       xs={8}
                                       className='flex justify-end'
                                    >
                                       <span className='m-auto text-sm font-semibold text-red-500 xl:text-base'>
                                          {priceFormat(
                                             item.product.prices.price *
                                                item.qty,
                                             isVnLang
                                          )}
                                       </span>
                                    </Col>
                                    <Col xl={1} md={1} xs={0}>
                                       <div className='flex items-center justify-end h-full'>
                                          <button
                                             className='cursor-pointer flex-center'
                                             onClick={() =>
                                                deleteItemMutation.mutate([
                                                   item._id,
                                                ])
                                             }
                                          >
                                             <RiDeleteBin5Line size={18} />
                                          </button>
                                       </div>
                                    </Col>
                                 </Row>
                              </div>
                           ))}
                     </div>

                     <div className='flex justify-between mt-8 xl:mt-12 md:mt-10'>
                        <Button
                           className={twMerge(
                              'mt-1 bg-gray-600 hover:bg-gray-700 xl:block hidden',
                              isCheck.length === 0 &&
                                 'opacity-75 pointer-events-none'
                           )}
                           onClick={() => setOpenModal(true)}
                        >
                           {isCheck.length > 0 ? (
                              <span>
                                 {isCheck.length === cart.length
                                    ? t('action.deleteAll', { ns: 'mutual' })
                                    : isCheck.length === 1
                                    ? `${t('action.delete', {
                                         ns: 'mutual',
                                      })} ${isCheck.length} ${t('item')}`
                                    : `${t('action.delete', {
                                         ns: 'mutual',
                                      })} ${isCheck.length} ${t('items')}`}
                              </span>
                           ) : (
                              t('action.delete', { ns: 'mutual' })
                           )}
                        </Button>
                        <div className='flex justify-end flex-1 mobile:flex-col'>
                           <div className='flex flex-col items-end'>
                              <div className='space-x-2'>
                                 <span>
                                    {t('total')} ({qty}
                                    {qty > 1 ? t('items') : t('item')}):
                                 </span>
                                 <span className='text-sm font-semibold text-red-500 xl:text-lg md:text-base'>
                                    {priceFormat(subTotal, isVnLang)}
                                 </span>
                              </div>
                              <div className='space-x-2 text-xs xl:text-sm'>
                                 <span>{t('saved')}:</span>
                                 <span className='font-semibold text-red-500'>
                                    {priceFormat(
                                       originTotal - subTotal,
                                       isVnLang
                                    )}
                                 </span>
                              </div>
                           </div>
                           <Link
                              to='/checkout'
                              className='xl:h-14 xl:w-60 h-11 w-44 rounded xl:flex-center bg-[#3085C3] xl:text-sm text-xs text-white duration-150 hover:-translate-y-[2px] hover:shadow-[0_8px_8px_-6px_#3085C3] ml-auto md:ml-4 mobile:mt-2'
                           >
                              <button className='w-full h-full font-bold cursor-pointer mobile:text-13 text-inherit'>
                                 {t('cart.proceedCheckOut')}
                              </button>
                           </Link>
                        </div>
                     </div>
                  </>
               ) : (
                  <div className='flex-column flex-center'>
                     <div className='w-[20%] py-10'>
                        <img src={images.empty_cart} alt='empty_cart' />
                     </div>
                     <p className='text-2xl font-semibold'>
                        {t('cart.cartEmpty')}
                     </p>
                     <span className='w-[300px] text-center opacity-75 text-sm'>
                        {t('cart.findAndAdd')}
                     </span>
                     <button
                        className='mt-10 py-6 w-[300px] shadow-[0_4px_20px_-6px_#000] rounded-full text-lg text-red-500 font-semibold cursor-pointer'
                        onClick={() => navigate('/shop')}
                     >
                        {t('cart.startShopping')}
                     </button>
                  </div>
               )}
            </div>
            <Modal
               open={openModal}
               className='!rounded bg-white pb-0'
               onCancel={() => setOpenModal(false)}
               footer={
                  <div className='flex justify-end mb-2 space-x-2'>
                     <Button
                        className='px-4 py-1 rounded h-9 bg-[#3085C3] hover:bg-[#3086c3de]'
                        onClick={() => setOpenModal(false)}
                     >
                        {t('action.cancel', { ns: 'mutual' })}
                     </Button>
                     <Button
                        className='px-4 py-1 text-black bg-gray-100 rounded h-9 hover:bg-gray-200'
                        onClick={() => {
                           deleteItemMutation.mutate(isCheck);
                           setOpenModal(false);
                        }}
                     >
                        {t('action.delete', { ns: 'mutual' })}
                     </Button>
                  </div>
               }
            >
               <div className='pt-4 pb-2 text-lg'>
                  {t('cart.wantDelete?', {
                     quantity:
                        isCheck.length === cart.length ? '' : isCheck.length,
                     text:
                        isCheck.length === cart.length
                           ? t('allItems')
                           : isCheck.length === 1
                           ? t('item')
                           : t('items'),
                  })}
               </div>
            </Modal>
         </div>
      </>
   );
};

export default Cart;
