import * as z from 'zod';
import { Row, Col } from 'antd';
import { Dispatch, FC, SetStateAction, useState } from 'react';
import { twMerge } from 'tailwind-merge';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';

import { ImPaypal } from 'react-icons/im';
import { BsCheck } from 'react-icons/bs';
import { RiEBike2Line } from 'react-icons/ri';
import { MdOutlineLocalShipping } from 'react-icons/md';
import { IoRocketOutline } from 'react-icons/io5';

import {
   BreadCrumb,
   Button,
   Error,
   Input,
   LoadingOverlay,
   PageTitle,
   Paypal,
} from '@/components';

import cartStore from '@/stores/cartStore';
import authStore from '@/stores/authStore';
import { couponApi, orderApi } from '@/api';
import { OrderUpload } from '@/types/order';
import { notify, priceFormat } from '@/helpers';
import images from '@/assets/images';

const infoSchema = z.object({
   phone: z.string().nonempty('Phone cannot be empty'),
   address: z.string().nonempty('Address cannot be empty'),
});

const CheckOut = () => {
   const navigate = useNavigate();
   const { currentUser, updateUser } = authStore();
   const { cart, subTotal } = cartStore();

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
   const [paymentMethod, setPaymentMethod] = useState<
      'paypal' | 'cash' | 'vnpay'
   >('cash');

   const { t, i18n } = useTranslation(['home', 'mutual']);
   const isVnLang = i18n.language === 'vi';

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
      onSuccess: ({ _id, type, value, code }) => {
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
         setCoupon(_id);
         setCouponCode(code);
      },
      onError: ({ message }) => {
         notify('error', isVnLang ? message.vi : message.en);
      },
   });

   const createOrderMutation = useMutation({
      mutationFn: (values: OrderUpload) => orderApi.create(values),
      onSuccess: () => {
         navigate('success');
      },
      onError: ({ message }) => {
         notify('error', isVnLang ? message.vi : message.en);
      },
   });

   const createPaymentVnPayMutation = useMutation({
      mutationFn: (values: OrderUpload) => orderApi.createPayment(values),
      onSuccess: ({ vnpUrl }) => {
         console.log(vnpUrl);

         window.location.assign(vnpUrl);
      },
      onError: ({ message }) => {
         notify('error', isVnLang ? message.vi : message.en);
      },
   });

   const handleSaveOrder = async () => {
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
         message: message,
         paymentMethod: paymentMethod,
         paid: paymentMethod === 'paypal' || paymentMethod === 'vnpay',
      };
      if (discount.price !== 0) {
         orderPayload.coupon = coupon;
      }

      // if (paymentMethod === 'vnpay') {
      //    createPaymentVnPayMutation.mutate({ ...orderPayload, paid: true });
      // } else {
      //    createOrderMutation.mutate(orderPayload);
      // }
      // await updateUser(currentUser?._id!, getValues());
   };

   return (
      <>
         <PageTitle title='Check out' />
         {createPaymentVnPayMutation.isLoading && <LoadingOverlay />}
         <BreadCrumb
            className='mobile:hidden'
            items={[
               {
                  title: t('home.home'),
               },
               {
                  title: t('checkout.checkout'),
               },
            ]}
         />
         <div className='mobile:pt-4 mobile:px-2'>
            {/* <Confetti
               width={window.innerWidth - 10}
               height={window.innerHeight}
               run={true}
            /> */}
            {/* <SweetAlert2
               show={true}
               position='top'
               text={`${t('checkout.thanksForShop')} 😘`}
               imageUrl={images.thank}
               imageWidth={400}
               imageHeight={200}
               showConfirmButton={isSuccess}
               onConfirm={() => {
                  navigate('/account/my-orders');
                  deleteCart();
               }}
               onResolve={() => {
                  navigate('/account/my-orders');
                  deleteCart();
               }}
            /> */}
            {createOrderMutation.isLoading && <LoadingOverlay />}
            <Row gutter={[32, { xs: 12 }]}>
               <Col xl={14} xs={24} className='space-y-4 '>
                  <div className='flex flex-col h-full md:pt-6 md:pb-12'>
                     <div className='flex flex-col space-y-2'>
                        <h2 className='text-base font-medium mobile:text-sm'>
                           {t('checkout.personalDetails')}
                        </h2>

                        <div className='flex md:space-x-3 mobile:flex-col'>
                           <div className='flex flex-col flex-1'>
                              <label className='mobile:text-xs' htmlFor='phone'>
                                 {t('label.phone', { ns: 'mutual' })}
                              </label>

                              <Input
                                 className='text-13'
                                 {...register('phone')}
                                 isError={!!errors?.phone}
                              />
                              <Error message={errors.phone?.message} />
                           </div>
                           <div className='flex flex-col flex-[2]'>
                              <label
                                 className='mobile:text-xs'
                                 htmlFor='address'
                              >
                                 {t('label.address', { ns: 'mutual' })}
                              </label>

                              <Input
                                 className='text-13'
                                 {...register('address')}
                                 isError={!!errors?.address}
                              />
                              <Error message={errors.address?.message} />
                           </div>
                        </div>
                     </div>
                     <div className='flex flex-col mt-4 space-y-2'>
                        <h2 className='text-base font-medium mobile:text-sm'>
                           {t('checkout.shippingDetails')}
                        </h2>
                        <Row
                           gutter={[
                              0,
                              {
                                 xs: 12,
                                 md: 12,
                              },
                           ]}
                        >
                           <Col xl={8} xs={24}>
                              <div
                                 className='flex flex-col flex-1 cursor-pointer'
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
                                    <div className='flex flex-col text-xs xl:text-sm'>
                                       <span>{t('checkout.normal')}</span>
                                       <span>
                                          ~7days: {priceFormat(20000, isVnLang)}
                                       </span>
                                    </div>
                                    <div
                                       className={twMerge(
                                          'absolute w-4 -translate-y-1/2 border border-gray-300 rounded-full right-3 top-1/2 aspect-square duration-100',
                                          shipCost === 20000 && 'bg-[#3085C3]'
                                       )}
                                    />
                                 </div>
                              </div>
                           </Col>
                           <Col xl={8} xs={24}>
                              <div
                                 className='flex flex-col flex-1 cursor-pointer'
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
                                    <div className='flex flex-col text-xs xl:text-sm'>
                                       <span>{t('checkout.fast')}</span>
                                       <span>
                                          4-5days:{' '}
                                          {priceFormat(30000, isVnLang)}
                                       </span>
                                    </div>
                                    <div
                                       className={twMerge(
                                          'absolute w-4 -translate-y-1/2 border border-gray-300 rounded-full right-3 top-1/2 aspect-square cursor-pointer duration-100',
                                          shipCost === 30000 && 'bg-[#3085C3]'
                                       )}
                                    />
                                 </div>
                              </div>
                           </Col>
                           <Col xl={8} xs={24}>
                              <div
                                 className='flex flex-col flex-1 cursor-pointer'
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
                                    <div className='flex flex-col text-xs xl:text-sm'>
                                       <span>{t('checkout.express')}</span>
                                       <span>
                                          1-2days:{' '}
                                          {priceFormat(50000, isVnLang)}
                                       </span>
                                    </div>
                                    <div
                                       className={twMerge(
                                          'absolute w-4 -translate-y-1/2 border border-gray-300 rounded-full right-3 top-1/2 aspect-square cursor-pointer duration-100',
                                          shipCost === 50000 && 'bg-[#3085C3]'
                                       )}
                                    />
                                 </div>
                              </div>
                           </Col>
                        </Row>
                     </div>
                     <div className='flex flex-col mt-6 space-y-2'>
                        <h2 className='text-base font-medium mobile:text-sm'>
                           {t('checkout.paymentMethod')}
                        </h2>

                        <div className='flex space-x-3'>
                           <Row
                              gutter={[
                                 0,
                                 {
                                    xs: 12,
                                    md: 12,
                                 },
                              ]}
                           >
                              <Col xl={8} xs={24}>
                                 <div
                                    className='flex flex-col cursor-pointer'
                                    onClick={() => setPaymentMethod('cash')}
                                 >
                                    <div
                                       className={twMerge(
                                          'relative flex items-center p-3 space-x-3 border bg-[#F9FAFB] rounded duration-150',
                                          paymentMethod === 'cash' &&
                                             'border-[#8075FF] bg-[#ebe8fe]'
                                       )}
                                    >
                                       <span className='text-xs xl:text-sm'>
                                          {t('checkout.cashPayment')}
                                       </span>
                                       <div
                                          className={twMerge(
                                             'absolute w-4 -translate-y-1/2 border border-gray-300 rounded-full right-3 top-1/2 aspect-square duration-100',
                                             paymentMethod === 'cash' &&
                                                'bg-[#3085C3]'
                                          )}
                                       />
                                    </div>
                                 </div>
                              </Col>
                              <Col xl={8} xs={24}>
                                 <div
                                    className='flex flex-col cursor-pointer'
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
                                       <span className='text-xs xl:text-sm'>
                                          {t('checkout.paypalPayment')}
                                       </span>
                                       <div
                                          className={twMerge(
                                             'absolute w-4 -translate-y-1/2 border border-gray-300 rounded-full right-3 top-1/2 aspect-square cursor-pointer duration-100',
                                             paymentMethod === 'paypal' &&
                                                'bg-[#3085C3]'
                                          )}
                                          onClick={() =>
                                             setPaymentMethod('paypal')
                                          }
                                       />
                                    </div>
                                 </div>
                              </Col>
                              <Col xl={8} xs={24}>
                                 <div
                                    className='flex flex-col cursor-pointer'
                                    onClick={() => setPaymentMethod('vnpay')}
                                 >
                                    <div
                                       className={twMerge(
                                          'relative flex items-center p-3 space-x-3 border bg-[#F9FAFB] rounded duration-150',
                                          paymentMethod === 'vnpay' &&
                                             'border-[#8075FF] bg-[#ebe8fe]'
                                       )}
                                    >
                                       <ImPaypal />
                                       <span className='text-xs xl:text-sm'>
                                          {t('checkout.vnpayPayment')}
                                       </span>
                                       <div
                                          className={twMerge(
                                             'absolute w-4 -translate-y-1/2 border border-gray-300 rounded-full right-3 top-1/2 aspect-square cursor-pointer duration-100',
                                             paymentMethod === 'vnpay' &&
                                                'bg-[#3085C3]'
                                          )}
                                          onClick={() =>
                                             setPaymentMethod('vnpay')
                                          }
                                       />
                                    </div>
                                 </div>
                              </Col>
                           </Row>
                        </div>
                     </div>
                     <div className='flex flex-col mt-6 space-y-1 cursor-pointer '>
                        <h2 className='text-base font-medium mobile:text-sm'>
                           {t('checkout.message')}
                        </h2>

                        <div className='flex space-x-3 xl:w-1/2 xl:pr-1'>
                           <Input
                              className='w-full text-xs xl:text-sm'
                              value={message}
                              onChange={(e) =>
                                 setMessage(e.currentTarget.value)
                              }
                              placeholder={t('placeHolder.messForStore')}
                           />
                        </div>
                     </div>
                  </div>
               </Col>
               <Col xl={10} xs={24}>
                  <div className='md:px-4 px-2 md:py-6 py-3 bg-[#f6f6f6] rounded'>
                     <h2 className='text-base font-semibold xl:text-xl'>
                        {t('checkout.orderSummery')}
                     </h2>
                     <div className='py-2 space-y-2 xl:py-4'>
                        {cart.map((item, index) => (
                           <Row
                              key={index}
                              gutter={12}
                              className='flex items-center py-2'
                           >
                              <Col span={2}>
                                 <span className='text-xs xl:text-sm'>
                                    x{item.qty}
                                 </span>
                              </Col>
                              <Col span={9}>
                                 <div className='flex items-center space-x-2'>
                                    <img
                                       src={item.variant.thumbnail.url}
                                       className='w-6 rounded-full aspect-square'
                                       alt=''
                                    />
                                    <span className='font-medium line-clamp-1 mobile:text-xs'>
                                       {item.product.name}
                                    </span>
                                 </div>
                              </Col>

                              <Col span={7}>
                                 <div className='space-x-1 capitalize mobile:text-xs'>
                                    <span>{item.variant.color.name}</span>
                                    <span>- {item.size}</span>
                                 </div>
                              </Col>
                              <Col span={6}>
                                 <p className='font-semibold text-red-500 text-end mobile:text-13'>
                                    {priceFormat(
                                       item.product.prices.price * item.qty,
                                       isVnLang
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
                                 className='flex-1 mobile:text-xs'
                                 placeholder={t('placeHolder.enterCouponCode')}
                                 value={coupon}
                                 onChange={(e) =>
                                    setCoupon(e.currentTarget.value)
                                 }
                              />
                              <Button
                                 className='w-fit mobile:text-xs'
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
                              <span className='text-red-500 '>
                                 {couponCode}
                              </span>
                           </div>
                        )}
                     </div>
                     <div className='flex flex-col py-3 space-y-2 border-b border-gray-300'>
                        <div className='flex justify-between xl:text-base'>
                           <span>{t('checkout.subTotal')}: </span>
                           <span>{priceFormat(subTotal, isVnLang)}</span>
                        </div>
                        <div className='flex justify-between xl:text-base'>
                           <span>{t('checkout.shippingFee')}: </span>
                           <span>+ {priceFormat(shipCost, isVnLang)}</span>
                        </div>
                        <div className='flex justify-between xl:text-base'>
                           <span>{t('checkout.discount')}: </span>
                           <span>
                              {discount.price
                                 ? discount?.type === 'percent'
                                    ? `- ${priceFormat(
                                         discount.price,
                                         isVnLang
                                      )} ( ${discount.value}%)`
                                    : `- ${priceFormat(
                                         discount?.value!,
                                         isVnLang
                                      )}`
                                 : ' 0đ'}
                           </span>
                        </div>
                     </div>
                     <div className='flex flex-col pt-4 space-y-2'>
                        <div className='flex items-center justify-between text-base font-semibold xl:text-xl'>
                           <span>{t('checkout.total')}: </span>
                           <span className='text-lg text-red-500 xl:text-2xl'>
                              {priceFormat(
                                 subTotal + shipCost - discount.price,
                                 isVnLang
                              )}
                           </span>
                        </div>
                     </div>
                  </div>
                  <div className='mt-2 space-y-5 xl:mt-4'>
                     {paymentMethod === 'cash' && (
                        <div className='ml-auto mr-2 space-y-4'>
                           <div className='flex w-full h-12 space-x-2 '>
                              <Button className='flex-1 h-full text-black bg-white border border-gray-300 mobile:text-xs hover:bg-white'>
                                 {t('action.back', { ns: 'mutual' })}
                              </Button>
                              <Button
                                 className={twMerge(
                                    'w-2/3 h-full text-xs'
                                    // paymentMethod === 'paypal' &&
                                    //    'pointer-events-none'
                                 )}
                                 onClick={async () =>
                                    (await trigger(['address', 'phone'])) &&
                                    handleSaveOrder()
                                 }
                              >
                                 {t('checkout.pay')}
                              </Button>
                           </div>
                        </div>
                     )}

                     {paymentMethod === 'paypal' && (
                        <div className='relative'>
                           <Paypal
                              handleSaveOrder={handleSaveOrder}
                              amount={Math.ceil(
                                 (subTotal + shipCost - discount.price) / 24500
                              ).toString()}
                           />
                           <div
                              className={twMerge(
                                 'absolute top-0 left-0 z-[100000] w-full h-full bg-transparent',
                                 !!watch('address') &&
                                    !!watch('phone') &&
                                    'hidden'
                              )}
                              onClick={async () =>
                                 await trigger(['address', 'phone'])
                              }
                           />
                        </div>
                     )}
                     {paymentMethod === 'vnpay' && (
                        <Button
                           className={twMerge(
                              'w-full py-7 flex justify-center items-center space-x-4'
                              // paymentMethod === 'paypal' &&
                              //    'pointer-events-none'
                           )}
                           onClick={async () =>
                              (await trigger(['address', 'phone'])) &&
                              handleSaveOrder()
                           }
                        >
                           <img
                              src={images.vnpay}
                              alt='vnpay'
                              className='h-7 w-7'
                           />
                           <span>VnPay</span>
                        </Button>
                     )}
                  </div>
               </Col>
            </Row>
         </div>
      </>
   );
};

export default CheckOut;
