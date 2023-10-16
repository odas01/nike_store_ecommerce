import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MdOutlineLocalShipping } from 'react-icons/md';
import { Row, Col, Breadcrumb } from 'antd';
import Confetti from 'react-confetti';

import { couponApi, orderApi } from '@/api';

import { notify, priceFormat } from '@/helpers';
import cartStore from '@/stores/cartStore';
import authStore from '@/stores/authStore';
import { Button, Error, Input, Paypal } from '@/components';
import { useForm } from 'react-hook-form';
import { ErrorResponse } from '@/types';
import { OrderUpload } from '@/types/order';
import { twMerge } from 'tailwind-merge';
import { ImPaypal } from 'react-icons/im';
import { BsCheck } from 'react-icons/bs';
import { useTranslation } from 'react-i18next';
import SweetAlert2 from 'react-sweetalert2';
import images from '@/assets/images';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { RiEBike2Line } from 'react-icons/ri';
import { IoRocketOutline } from 'react-icons/io5';

const infoSchema = z.object({
   phone: z.string().nonempty('Phone cannot be empty'),
   address: z.string().nonempty('Address cannot be empty'),
});

const CheckOut = () => {
   const { currentUser, updateUser } = authStore();
   const { cart, deleteCart, subTotal } = cartStore();

   const [coupon, setCoupon] = useState<string>('');
   const [couponCode, setCouponCode] = useState<string>('');
   const [message, setMessage] = useState<string>('');
   const [shipCost, setShipCost] = useState<20000 | 30000 | 50000>(20000);
   const [discount, setDiscount] = useState<{
      type: 'percent' | 'vnd';
      value: number;
      price: number;
   }>({
      type: 'vnd',
      value: 0,
      price: 0,
   });
   const [paymentMethod, setPaymentMethod] = useState<'paypal' | 'cash'>(
      'cash'
   );
   const [isSuccess, setIsSuccess] = useState<boolean>(false);

   const { t } = useTranslation(['home', 'mutual', 'dashboard']);
   const navigate = useNavigate();

   const {
      register,
      getValues,
      formState: { errors },
      trigger,
      watch,
   } = useForm<{
      phone: string;
      address: string;
   }>({
      defaultValues: {
         phone: currentUser?.phone || '',
         address: currentUser?.address || '',
      },
      mode: 'onChange',
      resolver: zodResolver(infoSchema),
   });

   const checkCouponMutation = useMutation({
      mutationFn: () => couponApi.check(coupon),
      onSuccess: ({ _id, type, value, quantity, code }) => {
         // if (data.quantity === 100) {
         //    setCoupon('');
         //    notify('error', 'Coupon has expired');
         // }
         // console.log(data);
         setCoupon(_id);
         setCouponCode(code);
         if (quantity > 0) {
            let discountValue;
            if (type === 'percent') {
               discountValue = (subTotal * value) / 100;
               setDiscount({
                  type: 'percent',
                  value,
                  price: discountValue,
               });
            } else {
               discountValue = value;
               setDiscount({
                  type: 'vnd',
                  value,
                  price: discountValue,
               });
            }
         }
      },
      onError: (err: ErrorResponse) => {
         notify('error', err.message);
      },
   });

   const createOrderMutation = useMutation({
      mutationFn: (values: OrderUpload) => orderApi.create(values),
      onSuccess: () => {
         deleteCart();
         setIsSuccess(true);
      },
      onError: (err: ErrorResponse) => {
         notify('error', err.message);
      },
   });

   const handleSaveOrder = async (paid: boolean) => {
      const newCart = cart.map((item) => ({
         product: item.product._id,
         variant: item.variant._id,
         name: item.product.name,
         price: item.product.prices.price,
         thumbnail: item.variant.thumbnail.url,
         qty: item.qty,
         size: item.size,
      }));

      const orderPayload: OrderUpload = {
         phone: getValues('phone'),
         address: getValues('address'),
         products: newCart,
         shippingCost: shipCost,
         discount: discount.price,
         subTotal: subTotal,
         total: subTotal + shipCost - discount.price,
         coupon: coupon,
         message: message,
         paymentMethod: paymentMethod,
         paid,
      };
      await updateUser(currentUser?._id!, getValues());
      createOrderMutation.mutate(orderPayload);
   };

   return (
      <div className='container space-y-4'>
         <Breadcrumb
            items={[
               {
                  title: <Link to='/'>{t('navbar.home', { ns: 'home' })}</Link>,
               },
               {
                  title: 'Checkout',
               },
            ]}
         />
         <Confetti
            width={window.innerWidth}
            height={window.innerHeight}
            run={isSuccess}
         />
         <SweetAlert2
            show={isSuccess}
            position='top'
            text={`${t('checkout.thanksForShop')} 😘`}
            imageUrl={images.thank}
            imageWidth={400}
            imageHeight={200}
            showConfirmButton={isSuccess}
            onConfirm={() => navigate('/')}
         />
         <Row gutter={16}>
            <Col span={14} className='space-y-4 '>
               <div className='flex flex-col h-full pt-6 pb-12'>
                  <div className='flex flex-col space-y-1'>
                     <h2 className='text-base font-semibold'>
                        {t('checkout.personalDetails')}
                     </h2>

                     <div className='flex space-x-3'>
                        <div className='flex flex-col flex-1'>
                           <label htmlFor='phone'>
                              {t('label.phoneNumber', { ns: 'mutual' })}
                           </label>

                           <Input
                              {...register('phone')}
                              isError={!!errors?.phone}
                           />
                           <Error message={errors.phone?.message} />
                        </div>
                        <div className='flex flex-col flex-[2]'>
                           <label htmlFor='address'>
                              {t('label.address', { ns: 'mutual' })}
                           </label>

                           <Input
                              {...register('address')}
                              isError={!!errors?.address}
                           />
                           <Error message={errors.address?.message} />
                        </div>
                     </div>
                  </div>
                  <div className='flex flex-col mt-4 space-y-1 cursor-pointer '>
                     <h2 className='text-base font-semibold'>
                        {t('checkout.shippingDetails')}
                     </h2>

                     <div className='flex space-x-3'>
                        <div
                           className='flex flex-col flex-1'
                           onClick={() => {
                              setShipCost(20000);
                           }}
                        >
                           <div
                              className={twMerge(
                                 'relative flex items-center p-3 space-x-3 border bg-[#F9FAFB] rounded duration-150',
                                 shipCost === 20000 &&
                                    'border-[#8075FF] bg-[#ebe8fe]'
                              )}
                           >
                              <RiEBike2Line size={28} />
                              <div className='flex flex-col'>
                                 <span>{t('checkout.normal')}</span>
                                 <span>~7days: {priceFormat(20000)}</span>
                              </div>
                              <div
                                 className={twMerge(
                                    'absolute w-4 -translate-y-1/2 border border-gray-300 rounded-full right-3 top-1/2 aspect-square  duration-100',
                                    shipCost === 20000 && 'bg-[#3085C3]'
                                 )}
                              />
                           </div>
                        </div>
                        <div
                           className='flex flex-col flex-1'
                           onClick={() => {
                              setShipCost(30000);
                           }}
                        >
                           <div
                              className={twMerge(
                                 'relative flex items-center p-3 space-x-3 border bg-[#F9FAFB] rounded duration-150',
                                 shipCost === 30000 &&
                                    'border-[#8075FF] bg-[#ebe8fe]'
                              )}
                           >
                              <MdOutlineLocalShipping size={28} />
                              <div className='flex flex-col'>
                                 <span>{t('checkout.fash')}</span>
                                 <span>4-5days: {priceFormat(30000)}</span>
                              </div>
                              <div
                                 className={twMerge(
                                    'absolute w-4 -translate-y-1/2 border border-gray-300 rounded-full right-3 top-1/2 aspect-square cursor-pointer duration-100',
                                    shipCost === 30000 && 'bg-[#3085C3]'
                                 )}
                              />
                           </div>
                        </div>
                        <div
                           className='flex flex-col flex-1'
                           onClick={() => {
                              setShipCost(50000);
                           }}
                        >
                           <div
                              className={twMerge(
                                 'relative flex items-center p-3 space-x-3 border bg-[#F9FAFB] rounded duration-150',
                                 shipCost === 50000 &&
                                    'border-[#8075FF] bg-[#ebe8fe]'
                              )}
                           >
                              <IoRocketOutline size={28} />
                              <div className='flex flex-col'>
                                 <span>{t('checkout.express')}</span>
                                 <span>1-2days: {priceFormat(50000)}</span>
                              </div>
                              <div
                                 className={twMerge(
                                    'absolute w-4 -translate-y-1/2 border border-gray-300 rounded-full right-3 top-1/2 aspect-square cursor-pointer duration-100',
                                    shipCost === 50000 && 'bg-[#3085C3]'
                                 )}
                              />
                           </div>
                        </div>
                     </div>
                  </div>
                  <div className='flex flex-col mt-6 space-y-1 cursor-pointer '>
                     <h2 className='text-base font-semibold'>
                        {t('checkout.paymentMethod')}
                     </h2>

                     <div className='flex space-x-3'>
                        <div
                           className='flex flex-col flex-1'
                           onClick={() => setPaymentMethod('cash')}
                        >
                           <div
                              className={twMerge(
                                 'relative flex items-center p-3 space-x-3 border bg-[#F9FAFB] rounded duration-150',
                                 paymentMethod === 'cash' &&
                                    'border-[#8075FF] bg-[#ebe8fe]'
                              )}
                           >
                              <span> {t('checkout.cashPayment')}</span>
                              <div
                                 className={twMerge(
                                    'absolute w-4 -translate-y-1/2 border border-gray-300 rounded-full right-3 top-1/2 aspect-square duration-100',
                                    paymentMethod === 'cash' && 'bg-[#3085C3]'
                                 )}
                              />
                           </div>
                        </div>
                        <div
                           className='flex flex-col flex-1'
                           onClick={() => setPaymentMethod('paypal')}
                        >
                           <div
                              className={twMerge(
                                 'relative flex items-center p-3 space-x-3 border bg-[#F9FAFB] rounded duration-150',
                                 paymentMethod === 'paypal' &&
                                    'border-[#8075FF] bg-[#ebe8fe]'
                              )}
                           >
                              <ImPaypal />
                              <span> {t('checkout.paypalPayment')}</span>
                              <div
                                 className={twMerge(
                                    'absolute w-4 -translate-y-1/2 border border-gray-300 rounded-full right-3 top-1/2 aspect-square cursor-pointer duration-100',
                                    paymentMethod === 'paypal' && 'bg-[#3085C3]'
                                 )}
                                 onClick={() => setPaymentMethod('paypal')}
                              />
                           </div>
                        </div>
                     </div>
                  </div>
                  <div className='flex flex-col mt-6 space-y-1 cursor-pointer '>
                     <h2 className='text-base font-semibold'>
                        {t('checkout.message')}
                     </h2>

                     <div className='flex w-1/2 pr-1 space-x-3'>
                        <Input
                           className='w-full'
                           value={message}
                           onChange={(e) => setMessage(e.currentTarget.value)}
                           placeholder={t('placeHolder.messForStore')}
                        />
                     </div>
                  </div>
               </div>
            </Col>
            <Col span={10}>
               <div className='px-4 py-6 bg-[#f6f6f6] rounded'>
                  <h2 className='text-xl font-semibold'>
                     {t('checkout.orderSummery')}
                  </h2>
                  <div className='py-4 space-y-2'>
                     {cart.map((item, index) => (
                        <Row
                           key={index}
                           gutter={12}
                           className='flex items-center py-2'
                        >
                           <Col span={2}>
                              <span>x{item.qty}</span>
                           </Col>
                           <Col span={9}>
                              <div className='flex items-center space-x-2'>
                                 <img
                                    src={item.variant.thumbnail.url}
                                    className='w-6 rounded-full aspect-square'
                                    alt=''
                                 />
                                 <span className='font-semibold line-clamp-1'>
                                    {item.product.name}
                                 </span>
                              </div>
                           </Col>

                           <Col span={7}>
                              <div className='space-x-1 capitalize'>
                                 <span>{item.variant.color.name}</span>
                                 <span>- {item.size}</span>
                              </div>
                           </Col>
                           <Col span={6}>
                              <p className='font-semibold text-red-500 text-end'>
                                 {priceFormat(
                                    item.product.prices.price * item.qty
                                 )}
                              </p>
                           </Col>
                        </Row>
                     ))}
                  </div>
                  <div className='flex mt-4 mb-3 space-x-2'>
                     {discount.price === 0 ? (
                        <>
                           <Input
                              className='w-[80%]'
                              placeholder={t('placeHolder.enterCouponCode')}
                              value={coupon}
                              onChange={(e) => setCoupon(e.currentTarget.value)}
                           />
                           <Button
                              className='flex-1 rounded'
                              onClick={() => checkCouponMutation.mutate()}
                           >
                              {t('action.apply', { ns: 'mutual' })}
                           </Button>
                        </>
                     ) : (
                        <div className='flex items-center justify-between w-full h-10 px-4 bg-[#eaeaea] rounded'>
                           <span className='flex items-center text-green-600'>
                              {t('checkout.couponApplied')}
                              <BsCheck size={20} />
                           </span>
                           <span className='text-red-500 '>{couponCode}</span>
                        </div>
                     )}
                  </div>
                  <div className='flex flex-col py-3 space-y-2 border-b border-gray-300'>
                     <div className='flex justify-between text-base'>
                        <span>{t('checkout.subTotal')}: </span>
                        <span>{priceFormat(subTotal)}</span>
                     </div>
                     <div className='flex justify-between text-base'>
                        <span>{t('checkout.shippingFee')}: </span>
                        <span>+ {priceFormat(shipCost)}</span>
                     </div>
                     <div className='flex justify-between text-base'>
                        <span>{t('checkout.discount')}: </span>
                        <span>
                           -
                           {discount
                              ? discount?.type === 'percent'
                                 ? `${priceFormat(discount.price)} ( ${
                                      discount.value
                                   }%)`
                                 : priceFormat(discount?.value!)
                              : ' 0đ'}
                        </span>
                     </div>
                  </div>
                  <div className='flex flex-col pt-4 space-y-2'>
                     <div className='flex items-center justify-between text-xl font-semibold'>
                        <span>{t('checkout.total')}: </span>
                        <span className='text-2xl text-red-500'>
                           {priceFormat(subTotal + shipCost - discount.price)}
                        </span>
                     </div>
                  </div>
               </div>
               <div className='mt-4 space-y-5'>
                  <div className='ml-auto mr-2 space-y-4'>
                     <div className='flex w-full h-12 space-x-2 '>
                        <Button className='flex-1 h-full text-black bg-white border border-gray-300 rounded hover:bg-white'>
                           {t('action.back', { ns: 'mutual' })}
                        </Button>
                        <Button
                           className={twMerge(
                              'w-2/3 rounded h-full',
                              paymentMethod === 'paypal' &&
                                 'pointer-events-none'
                           )}
                           onClick={async () =>
                              (await trigger(['address', 'phone'])) &&
                              handleSaveOrder(false)
                           }
                        >
                           {t('checkout.pay')}
                        </Button>
                     </div>
                  </div>
                  {paymentMethod === 'paypal' && (
                     <div className='relative'>
                        <Paypal
                           handleSaveOrder={() => handleSaveOrder(true)}
                           amount={Math.round(
                              (subTotal + shipCost - discount.price) / 23500
                           ).toString()}
                        />
                        <div
                           className={twMerge(
                              'absolute top-0 left-0 z-[100000] w-full h-full bg-transparent',
                              !!watch('address') && !!watch('phone') && 'hidden'
                           )}
                           onClick={async () =>
                              await trigger(['address', 'phone'])
                           }
                        />
                     </div>
                  )}
               </div>
            </Col>
         </Row>
      </div>
   );
};

export default CheckOut;
