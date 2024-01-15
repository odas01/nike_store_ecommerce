import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Button, PageTitle } from '@/components';
import { orderApi } from '@/api';
import { Col, Modal, Row, Spin } from 'antd';
import { useTranslation } from 'react-i18next';
import RatingProduct from './RatingProduct';
import { AiFillStar, AiOutlineClose } from 'react-icons/ai';
import { notify, priceFormat } from '@/helpers';
const OrderDetail = () => {
   const { orderId } = useParams();
   const { data, isLoading } = useQuery({
      queryKey: ['orderdetail', orderId],
      queryFn: () => orderApi.get(orderId!),
      enabled: !!orderId,
   });

   const { t, i18n } = useTranslation(['home', 'mutual', 'dashboard']);
   const isVnLang = i18n.language === 'vi';
   const navigate = useNavigate();
   const [productActive, setProductActive] = useState<any | null>(null);
   const updateOrderMutation = useMutation({
      mutationFn: ({ id, status }: { id: string; status: string }) =>
         orderApi.update(id, { status, paid: status === 'delivered' }),
      onSuccess: ({ message }) => {
         notify('success', isVnLang ? message.vi : message.en);
         setOpenModel(false);
         navigate(-1);
      },
      onError: ({ message }) => {
         notify('success', isVnLang ? message.vi : message.en);
      },
   });

   const [openModel, setOpenModel] = useState<boolean>(false);

   return (
      <>
         <PageTitle title='Order Detail' />
         <div className='space-y-2'>
            <h2 className='text-xl font-semibold '>
               {t('orderDetail', { ns: 'mutual' })}
            </h2>

            {isLoading ? (
               <div className='absolute top-0 right-0 z-10 flex items-center justify-center w-full h-full'>
                  <Spin size='large' />
               </div>
            ) : data ? (
               <>
                  <div className='overflow-hidden font-medium border rounded-lg'>
                     <div className='bg-[#dedfe3]'>
                        <Row>
                           <Col span={14}>
                              <p className='px-4 py-3'>
                                 {t('product', { ns: 'mutual' })}
                              </p>
                           </Col>

                           <Col span={6}>
                              <p className='py-3'>
                                 {t('rating', { ns: 'mutual' })}
                              </p>
                           </Col>
                           <Col span={4}> </Col>
                        </Row>
                     </div>
                     {data.products.map((product, index) => (
                        <div key={index}>
                           <Row>
                              <Col span={14}>
                                 <Link
                                    to={`/d/${product.product.slug}`}
                                    className='flex items-center px-4 py-3 space-x-5'
                                 >
                                    <img
                                       src={product.thumbnail}
                                       className='w-20 aspect-square'
                                       alt=''
                                    />
                                    <div className='flex flex-col'>
                                       <span className='text-lg'>
                                          {product.name}
                                       </span>
                                       <span className='italic font-normal capitalize'>
                                          {product.variant.color.name} -{' '}
                                          {product.size}
                                       </span>
                                    </div>
                                 </Link>
                              </Col>
                              <Col span={6}>
                                 <div className='flex items-center w-full h-full'>
                                    {product?.isRating ? (
                                       <div className='flex flex-col flex-1 space-y-2'>
                                          <span className='flex items-center spax'>
                                             {product.rating.rate}
                                             <AiFillStar
                                                color='#F8DE22'
                                                size={20}
                                             />
                                          </span>
                                          <span className='italic line-clamp-2'>
                                             {product.rating?.comment ||
                                                'No message'}
                                          </span>
                                       </div>
                                    ) : (
                                       t('mutual:noRating')
                                    )}
                                 </div>
                              </Col>
                              <Col span={4}>
                                 {!product?.isRating &&
                                    data.status === 'delivered' && (
                                       <div className='flex items-center justify-center h-full'>
                                          <Button
                                             className='px-3 py-0.5 text-xs rounded'
                                             onClick={() =>
                                                setProductActive(product)
                                             }
                                          >
                                             {t('rating', { ns: 'mutual' })}
                                          </Button>
                                       </div>
                                    )}
                              </Col>
                           </Row>
                        </div>
                     ))}
                  </div>
                  <div className='flex flex-col items-end space-y-2'>
                     <div className='flex justify-between w-1/2 px-5 py-3 text-base bg-gray-200 rounded'>
                        <div className='space-y-1'>
                           <p>{t('label.name', { ns: 'mutual' })}: </p>
                           <p>{t('label.phone', { ns: 'mutual' })}: </p>
                           <p>{t('label.address', { ns: 'mutual' })}: : </p>
                           <p>{t('label.method', { ns: 'mutual' })}: </p>
                           <p>{t('label.message', { ns: 'mutual' })}: </p>
                        </div>
                        <div className='space-y-1 [&>p]:text-end'>
                           <p>{data.user.name}</p>
                           <p>{data.user.phone}</p>
                           <p>{data.address}</p>
                           <p>
                              {data.paymentMethod === 'cash'
                                 ? t('cash', { ns: 'mutual' })
                                 : data.paymentMethod}
                           </p>
                           <p>{data.message}</p>
                        </div>
                     </div>
                     <div className='flex justify-between w-[40%] py-3 px-5 text-base bg-gray-200 rounded'>
                        <div className='space-y-1'>
                           <p>{t('checkout.subTotal')}: </p>
                           <p>
                              {t('order.shippingCost', {
                                 ns: 'mutual',
                              })}
                              :{' '}
                           </p>
                           <p>
                              {t('label.discount', {
                                 ns: 'mutual',
                              })}
                              :{' '}
                           </p>
                           <p className='pt-4 text-lg font-semibold'>
                              {t('total')}:{' '}
                           </p>
                        </div>
                        <div className='space-y-1 [&>p]:text-end'>
                           <p>{priceFormat(data.subTotal, isVnLang)}</p>
                           <p>
                              +{priceFormat(data.shippingCost || 0, isVnLang)}
                           </p>
                           <p>-{priceFormat(data.discount || 0, isVnLang)}</p>
                           <p className='pt-4 text-xl font-semibold'>
                              {priceFormat(data.total || 0, isVnLang)}
                           </p>
                        </div>
                     </div>
                     {data.status === 'pending' && (
                        <Button onClick={() => setOpenModel(true)}>
                           {' '}
                           {t('mutual:cancelOrder')}
                        </Button>
                     )}
                  </div>
               </>
            ) : (
               <p className='flex justify-center py-8 text-base'>
                  {t('dontOrder')}
               </p>
            )}
            <Modal
               width='50%'
               open={!!productActive}
               onCancel={() => setProductActive(null)}
               footer={null}
               className='!rounded bg-white'
            >
               <div className=''>
                  <h2 className='mb-6 text-2xl font-medium text-center uppercase'>
                     {t('ratingProduct', { ns: 'mutual' })}
                  </h2>
                  <RatingProduct
                     data={productActive}
                     setProductActive={setProductActive}
                  />
               </div>
            </Modal>
            <Modal
               open={openModel}
               footer={null}
               title={null}
               centered
               closeIcon={
                  <div className='text-black dark:text-white'>
                     <AiOutlineClose color='inherit' />
                  </div>
               }
               className='bg-white dark:bg-[#1A1C23] text-black dark:text-white p-4 rounded-lg'
               onCancel={() => setOpenModel(false)}
            >
               <h2 className='mb-8 text-xl'>{t('dashboard:confirmCancel')}</h2>
               <div
                  className='w-fit ml-auto flex items-center px-2.5 py-1.5 space-x-2 text-white bg-red-500 rounded-sm cursor-pointer'
                  onClick={() =>
                     updateOrderMutation.mutate({
                        id: data?._id!,
                        status: 'cancel',
                     })
                  }
               >
                  <AiOutlineClose color='inherit' />
                  <span>{t('dashboard:order.cancel')} </span>
               </div>
            </Modal>
         </div>
      </>
   );
};

export default OrderDetail;
