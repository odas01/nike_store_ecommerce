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
            <h2 className='pb-2 text-lg font-semibold text-center uppercase xl:normal-case xl:pb-4 xl:text-start md:text-xl'>
               {t('orderDetail', { ns: 'mutual' })}
            </h2>

            {isLoading ? (
               <div className='absolute top-0 right-0 z-10 flex items-center justify-center w-full h-full'>
                  <Spin size='large' />
               </div>
            ) : data ? (
               <>
                  <div className='overflow-hidden font-medium border rounded-lg'>
                     <div className='bg-[#dedfe3] mobile:hidden'>
                        <Row className='[&>div]:xl:text-sm [&>div]:text-13'>
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
                              <Col xl={14} md={14} xs={18}>
                                 <Link
                                    to={`/d/${product.product.slug}`}
                                    className='flex items-center p-2 space-x-5 md:px-4 md:py-3'
                                 >
                                    <img
                                       src={product.thumbnail}
                                       className='w-12 xl:w-20 md:w-16 aspect-square'
                                       alt=''
                                    />
                                    <div className='flex flex-col'>
                                       <span className='text-sm xl:text-lg md:text-base'>
                                          {product.name}
                                       </span>
                                       <span className='italic font-normal capitalize xl:text-sm md:text-13 text-11'>
                                          {product.variant.color.name} -{' '}
                                          {product.size}
                                       </span>
                                    </div>
                                 </Link>
                              </Col>
                              <Col
                                 xl={6}
                                 md={6}
                                 xs={{
                                    span: 24,
                                    order: 1,
                                 }}
                              >
                                 <div className='flex items-center w-full h-full mobile:justify-center mobile:py-2'>
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
                              <Col
                                 xl={4}
                                 md={4}
                                 xs={{
                                    span: 6,
                                 }}
                              >
                                 {!product?.isRating &&
                                    data.status === 'delivered' && (
                                       <div className='flex items-center justify-center h-full'>
                                          <Button
                                             className='px-3 py-0.5 rounded'
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
                  <Row gutter={[12, 6]}>
                     <Col xl={12} md={14} xs={24}>
                        <Row className='h-full px-4 py-2 text-base bg-gray-200 rounded xl:px-5 xl:py-3 md:px-4 md:py-2'>
                           <Col xl={14} md={14} xs={12}>
                              <div className='space-y-1 text-xs xl:text-base md:text-sm'>
                                 <p>{t('label.name', { ns: 'mutual' })}: </p>
                                 <p>{t('label.phone', { ns: 'mutual' })}: </p>
                                 <p>
                                    {t('label.address', { ns: 'mutual' })}: :{' '}
                                 </p>
                                 <p>{t('label.method', { ns: 'mutual' })}: </p>
                                 <p>{t('label.message', { ns: 'mutual' })}: </p>
                              </div>
                           </Col>
                           <Col xl={10} md={10} xs={12}>
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
                           </Col>
                        </Row>
                     </Col>
                     <Col xl={12} md={10} xs={24}>
                        <Row className='h-full px-4 py-2 bg-gray-200 rounded xl:px-5 xl:py-3 md:px-4 md:py-2'>
                           <Col xl={14} md={14} xs={12}>
                              <div className='space-y-1 text-xs xl:text-base md:text-sm'>
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
                                 <p className='text-sm font-semibold xl:pt-4 md:pt-2 xl:text-lg md:text-base'>
                                    {t('total')}:{' '}
                                 </p>
                              </div>
                           </Col>
                           <Col xl={10} md={10} xs={12}>
                              <div className='space-y-1 [&>p]:text-end text-xs xl:text-base md:text-sm'>
                                 <p>{priceFormat(data.subTotal, isVnLang)}</p>
                                 <p>
                                    +
                                    {priceFormat(
                                       data.shippingCost || 0,
                                       isVnLang
                                    )}
                                 </p>
                                 <p>
                                    -{priceFormat(data.discount || 0, isVnLang)}
                                 </p>
                                 <p className='text-base font-semibold md:text-lg xl:text-xl xl:pt-4'>
                                    {priceFormat(data.total || 0, isVnLang)}
                                 </p>
                              </div>
                           </Col>
                        </Row>
                     </Col>
                  </Row>
                  {data.status === 'pending' && (
                     <Button onClick={() => setOpenModel(true)}>
                        {' '}
                        {t('mutual:cancelOrder')}
                     </Button>
                  )}
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
