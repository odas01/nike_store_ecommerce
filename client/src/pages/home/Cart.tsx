import { Breadcrumb, Checkbox, Col, Modal, Row, Skeleton } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import cartStore from '@/stores/cartStore';
import images from '@/assets/images';
import { CartItemUpdate, CartUpload, ErrorResponse, ICartItem } from '@/types';
import { RiDeleteBin5Line } from 'react-icons/ri';
import { AiFillCaretDown, AiOutlineMinus, AiOutlinePlus } from 'react-icons/ai';
import { useMutation } from '@tanstack/react-query';
import { cartApi } from '@/api';
import { twMerge } from 'tailwind-merge';
import { notify, priceFormat } from '@/helpers';
import { CheckboxValueType } from 'antd/es/checkbox/Group';
import { useEffect, useState } from 'react';
import { CheckboxChangeEvent } from 'antd/es/checkbox';
import { Button } from '@/components';

const Cart = () => {
   const { t, i18n } = useTranslation(['home', 'mutual']);
   const isVn = i18n.language === 'vi';
   const { qty, cart, updateCart, getCart, subTotal } = cartStore();
   const navigate = useNavigate();

   const [isCheckAll, setIsCheckAll] = useState<boolean>(false);
   const [isCheck, setIsCheck] = useState<string[]>([]);
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
      onError: (error: ErrorResponse) => {
         notify('error', error.message);
      },
   });

   const deleteItemMutation = useMutation({
      mutationFn: (listId: string[]) => cartApi.deleteItems(listId),
      onSuccess: () => {
         getCart();
      },
      onError: (error: ErrorResponse) => {
         notify('error', error.message);
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
      <div className='container space-y-4'>
         <div>
            <h2 className='text-2xl font-semibold text-center uppercase'>
               {t('cart.cart')}
            </h2>
            {qty > 0 ? (
               <>
                  <div className='pb-2 mt-8 border-b border-gray-400'>
                     <Row className='font-semibold'>
                        <Col span={1}>
                           <Checkbox
                              onChange={handleCheckAll}
                              checked={isCheckAll}
                           />
                        </Col>
                        <Col span={8}>
                           <span>{t('cart.productName')}</span>
                        </Col>
                        <Col span={3} className='text-center'>
                           <span>{t('cart.variations')}</span>
                        </Col>
                        <Col span={4} className='text-center'>
                           <span>{t('cart.unitPrice')}</span>
                        </Col>
                        <Col span={3} className='text-center'>
                           <span>{t('label.quantity', { ns: 'mutual' })}</span>
                        </Col>
                        <Col span={4} className='text-center'>
                           <span>{t('cart.totalPrice')}</span>
                        </Col>
                     </Row>
                  </div>

                  <div>
                     {cart
                        .filter((item) => item.product)
                        .map((item, index) => (
                           <div
                              className={twMerge(
                                 'py-4 border-b border-gray-300',
                                 deleteItemMutation.isLoading &&
                                    deleteItemMutation.variables?.includes(
                                       item._id
                                    ) &&
                                    'pointer-events-none opacity-60'
                              )}
                              key={index}
                           >
                              <Row>
                                 <Col span={1} className='flex items-center'>
                                    <Checkbox
                                       onChange={(e) =>
                                          handleCheck(e, item._id)
                                       }
                                       checked={isCheck.includes(item._id)}
                                    />
                                 </Col>
                                 <Col span={8}>
                                    <Link
                                       to={'/d/' + item.product.slug}
                                       className='flex pr-6 hover:text-inherit'
                                    >
                                       <div className='w-20 overflow-hidden rounded aspect-square'>
                                          <img
                                             src={item.variant.thumbnail.url}
                                             className=''
                                             alt={item.product.name}
                                          />
                                       </div>
                                       <div className='flex-1 pt-2 pl-4'>
                                          <span className='text-base font-medium '>
                                             {item.product.name}
                                          </span>
                                       </div>
                                    </Link>
                                 </Col>
                                 <Col span={3}>
                                    <div className='flex flex-col items-center justify-center h-full'>
                                       <div className='flex items-center'>
                                          <span className='capitalize'>
                                             {item.variant.color.name}
                                          </span>
                                          {'  - Size'}
                                          <span className='ml-1 mr-2 uppercase'>
                                             {item.size}
                                          </span>
                                          <AiFillCaretDown />
                                       </div>
                                    </div>
                                 </Col>
                                 <Col
                                    span={4}
                                    className='flex flex-col items-center justify-center'
                                 >
                                    {item.product.discount !== 0 && (
                                       <p className='line-through italic text-[rgba(0,0,0,0.5)]'>
                                          {priceFormat(
                                             item.product.prices.originalPrice,
                                             isVn
                                          )}
                                       </p>
                                    )}
                                    <p className='text-base font-semibold'>
                                       {priceFormat(
                                          item.product.prices.price,
                                          isVn
                                       )}
                                    </p>
                                 </Col>
                                 <Col
                                    span={3}
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
                                             'flex items-center justify-center w-10 text-sm rounded-full aspect-square shadow-db',
                                             item.qty === 1 && 'opacity-60'
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
                                          className='text-base font-medium text-center w-14'
                                          readOnly
                                       />
                                       <button
                                          className='flex items-center justify-center w-10 text-sm rounded-full aspect-square shadow-db'
                                          onClick={() =>
                                             changeQty(item, 'plus')
                                          }
                                       >
                                          <AiOutlinePlus size={16} />
                                       </button>
                                    </div>
                                 </Col>
                                 <Col span={4} className='flex justify-end'>
                                    <span className='m-auto text-base font-semibold text-red-500'>
                                       {priceFormat(
                                          item.product.prices.price * item.qty,
                                          isVn
                                       )}
                                    </span>
                                 </Col>
                                 <Col span={1} className='flex justify-end'>
                                    <button
                                       className='cursor-pointer flex-center'
                                       onClick={() =>
                                          deleteItemMutation.mutate([item._id])
                                       }
                                    >
                                       <RiDeleteBin5Line size={18} />
                                    </button>
                                 </Col>
                              </Row>
                           </div>
                        ))}
                  </div>

                  <div className='flex justify-between mt-12'>
                     <Button
                        className={twMerge(
                           'mt-1 bg-gray-600 hover:bg-gray-700',
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
                                 ? `${t('action.delete', { ns: 'mutual' })} ${
                                      isCheck.length
                                   } ${t('item')}`
                                 : `${t('action.delete', { ns: 'mutual' })} ${
                                      isCheck.length
                                   } ${t('items')}`}
                           </span>
                        ) : (
                           t('action.delete', { ns: 'mutual' })
                        )}
                     </Button>
                     <div className='flex justify-end space-x-4'>
                        <div className='flex flex-col items-end'>
                           <div className='space-x-2'>
                              <span>
                                 {t('total')} ({qty}
                                 {qty > 1 ? t('items') : t('item')}):
                              </span>
                              <span className='text-lg font-semibold text-red-500'>
                                 {priceFormat(subTotal, isVn)}
                              </span>
                           </div>
                           <div className='space-x-2 text-sm'>
                              <span>{t('saved')}:</span>
                              <span className='font-semibold text-red-500'>
                                 {priceFormat(originTotal - subTotal, isVn)}
                              </span>
                           </div>
                        </div>
                        <div className='h-14 w-60 rounded flex-center bg-[#3085C3] text-white duration-150 hover:-translate-y-[2px] hover:shadow-[0_8px_8px_-6px_#3085C3]'>
                           <Link to='/checkout'>
                              <button className='w-full h-full text-base font-bold cursor-pointer text-inherit'>
                                 {t('cart.proceedCheckOut')}
                              </button>
                           </Link>
                        </div>
                     </div>
                  </div>

                  {/* <div className='pt-8'>
                     <Row justify='end'>
                        <Col span={7}>
                           <div className='flex-between-center'>
                              <span className='text-base font-medium'>
                                 Grand total:
                              </span>
                              <span className='text-xl font-semibold'>
                                 {totalPrice?.toLocaleString('vi-VN', {
                                    style: 'currency',
                                    currency: 'VND',
                                 })}
                              </span>
                           </div>
                           <div className='flex justify-end'>
                              <div className='mt-8 w-60 h-14 rounded-xl flex-center text-[#5B8FB9] border-[3px] border-current transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_8px_8px_-6px_currentcolor]'>
                                 <button
                                    className='w-full h-full text-base font-bold cursor-pointer text-inherit'
                                    onClick={() => navigate('/checkout')}
                                 >
                                    Check out
                                 </button>
                              </div>
                           </div>
                        </Col>
                     </Row>
                  </div> */}
               </>
            ) : (
               <div className='flex-column flex-center'>
                  <div className='w-[20%] py-10'>
                     <img src={images.empty_cart} alt='empty_cart' />
                  </div>
                  <p className='text-2xl font-semibold'>
                     Your Shopping List is Empty
                  </p>
                  <span className='w-[300px] text-center opacity-75 text-sm'>
                     Search for items to start addding them to your cart
                  </span>
                  <button
                     className='mt-10 py-6 w-[300px] shadow-[0_4px_20px_-6px_#000] rounded-full text-lg text-red-500 font-semibold cursor-pointer'
                     onClick={() => navigate('/shop')}
                  >
                     Start Shopping
                  </button>
               </div>
            )}
         </div>
         <Modal
            open={openModal}
            className='!rounded bg-white'
            onCancel={() => setOpenModal(false)}
            footer={
               <div className='flex justify-end mb-2 space-x-2'>
                  <Button
                     className='px-4 py-1 rounded h-9 bg-[#3085C3] hover:bg-[#3086c3de]'
                     onClick={() => setOpenModal(false)}
                  >
                     Cancel
                  </Button>
                  <Button
                     className='px-4 py-1 text-black bg-gray-100 rounded h-9 hover:bg-gray-200'
                     onClick={() => {
                        deleteItemMutation.mutate(isCheck);
                        setOpenModal(false);
                     }}
                  >
                     Delete
                  </Button>
               </div>
            }
         >
            <div className='pt-4 pb-2 text-lg'>
               Do you want delete{' '}
               {isCheck.length > 0 && (
                  <span>
                     {isCheck.length === cart.length
                        ? ' all items'
                        : isCheck.length === 1
                        ? ` ${isCheck.length} item`
                        : ` ${isCheck.length} items`}
                  </span>
               )}
               ?
            </div>
         </Modal>
      </div>
   );
};

export default Cart;
