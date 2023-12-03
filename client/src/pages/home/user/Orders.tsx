import { useState } from 'react';
import { twMerge } from 'tailwind-merge';
import { useTranslation } from 'react-i18next';
import { Col, Collapse, Row, Spin } from 'antd';
import { useQuery } from '@tanstack/react-query';

import { Dropdown, Input, PageTitle, Pagination } from '@/components';

import { orderApi } from '@/api';
import authStore from '@/stores/authStore';
import { dateFormat, priceFormat } from '@/helpers';
import moment from 'moment';

type Status = 'pending' | 'processing' | 'delivered' | 'cancel';

type Params = {
   status: string;
};

const Orders = () => {
   const { currentUser } = authStore();
   const [skip, setSkip] = useState<number>(0);
   const [params, setParams] = useState<Partial<Params>>({});

   const { t, i18n } = useTranslation(['home', 'mutual', 'dashboard']);
   const isVnLang = i18n.language === 'vi';

   const { data, isLoading } = useQuery({
      queryKey: ['orders', currentUser?._id, skip, params],
      queryFn: () =>
         orderApi.getAll({
            skip: skip,
            limit: 7,
            user: currentUser?._id,
            ...params,
         }),
      enabled: !!currentUser,
   });

   return (
      <>
         <PageTitle title='My orders' />
         <div className='space-y-2'>
            <h2 className='text-xl font-semibold '>{t('orders')}</h2>
            <div className='flex justify-end'>
               <Dropdown
                  items={[
                     {
                        label: (
                           <p
                              className='px-3 py-1'
                              onClick={() => setParams({})}
                           >
                              {t('navbar.all')}
                           </p>
                        ),
                     },
                     {
                        label: (
                           <p
                              className='px-3 py-1'
                              onClick={() =>
                                 setParams({ ...params, status: 'pending' })
                              }
                           >
                              {t('status.pending', { ns: 'mutual' })}
                           </p>
                        ),
                     },
                     {
                        label: (
                           <p
                              className='px-3 py-1'
                              onClick={() =>
                                 setParams({ ...params, status: 'processing' })
                              }
                           >
                              {' '}
                              {t('status.processing', { ns: 'mutual' })}
                           </p>
                        ),
                     },
                     {
                        label: (
                           <p
                              className='px-3 py-1'
                              onClick={() => {
                                 setParams({ ...params, status: 'delivered' });
                              }}
                           >
                              {' '}
                              {t('status.delivered', { ns: 'mutual' })}
                           </p>
                        ),
                     },
                     {
                        label: (
                           <p
                              className='px-3 py-1'
                              onClick={() =>
                                 setParams({ ...params, status: 'cancel' })
                              }
                           >
                              {' '}
                              {t('status.cancel', { ns: 'mutual' })}
                           </p>
                        ),
                     },
                  ]}
                  children={
                     <Input
                        placeholder={t('status.status', { ns: 'mutual' })}
                        className='h-full appearance placeholder:normal-case focus:cursor-pointer'
                        value={
                           params.status
                              ? t(`status.${params.status as Status}`, {
                                   ns: 'mutual',
                                })
                              : t('navbar.all')
                        }
                        readOnly
                     />
                  }
               />
            </div>
            {isLoading && currentUser ? (
               <div className='absolute top-0 right-0 z-10 flex items-center justify-center w-full h-full'>
                  <Spin size='large' />
               </div>
            ) : data && data.orders.length > 0 ? (
               <div className='overflow-hidden font-medium border rounded-lg'>
                  <div className='bg-[#dedfe3]'>
                     <Row>
                        <Col span={3}>
                           <p className='px-4 py-3'>ID</p>
                        </Col>
                        <Col span={5}>
                           <p className='px-4 py-3 text-15'>
                              {t('label.date', { ns: 'mutual' })}
                           </p>
                        </Col>
                        <Col span={3}></Col>
                        <Col span={6}>
                           <p className='px-4 py-3 text-15'>{t('coupon')}</p>
                        </Col>
                        <Col span={4}>
                           <p className='px-4 py-3 text-15'>{t('total')}</p>
                        </Col>
                        <Col span={3}>
                           <p className='px-4 py-3 text-end text-15'>
                              {t('status.status', { ns: 'mutual' })}
                           </p>
                        </Col>
                     </Row>
                  </div>

                  <Collapse
                     accordion
                     ghost
                     destroyInactivePanel
                     items={data.orders.map((order, index) => ({
                        key: index,
                        showArrow: false,
                        label: (
                           <div
                              className={twMerge(
                                 'border-t hover:bg-[rgba(0,0,0,0.024)] duration-150',
                                 order.status === 'cancel' &&
                                    'opacity-50 line-through'
                              )}
                           >
                              <Row>
                                 <Col span={3}>
                                    <p className='px-4 py-3'>
                                       {'#' + order._id.slice(-6, -1)}
                                    </p>
                                 </Col>
                                 <Col span={5}>
                                    <p className='px-4 py-3'>
                                       {moment(order.createdAt).format(
                                          'DD/MM YYYY HH:mm'
                                       )}
                                    </p>
                                 </Col>
                                 <Col span={3}></Col>
                                 <Col span={6}>
                                    <p className='px-4 py-3 capitalize'>
                                       {order?.coupon?.code}
                                    </p>
                                 </Col>
                                 <Col span={4}>
                                    <p className='px-4 py-3 font-semibold capitalize'>
                                       {priceFormat(order.total, isVnLang)}
                                    </p>
                                 </Col>
                                 <Col span={3}>
                                    <p className='px-4 py-3 capitalize text-end'>
                                       {t(`status.${order.status as Status}`, {
                                          ns: 'mutual',
                                       })}
                                    </p>
                                 </Col>
                              </Row>
                           </div>
                        ),
                        children: (
                           <div className='border-t bg-[#F3F4F6]'>
                              {order.products.map((item, index) => (
                                 <div key={index} className='border-gray-200'>
                                    <Row
                                       className='flex items-center'
                                       justify='end'
                                       key={index}
                                    >
                                       <Col xl={8}>
                                          <div className='flex items-center p-2 space-x-3'>
                                             <img
                                                src={item.thumbnail}
                                                className='w-16 aspect-square'
                                                alt={item.product.name}
                                             />
                                             <div className='flex flex-col'>
                                                <span className='text-15 line-clamp-1'>
                                                   {item.product.name}
                                                </span>
                                                <span className='text-xs italic uppercase'>
                                                   {item.variant.color.name} /{' '}
                                                   {item.size}
                                                </span>
                                             </div>
                                          </div>
                                       </Col>
                                       <Col span={2}>
                                          <p className='px-3 text-center'>
                                             x{item.qty}
                                          </p>
                                       </Col>
                                       <Col xl={3}>
                                          <p className='px-3 text-sm text-end'>
                                             {priceFormat(
                                                item.price * item.qty,
                                                isVnLang
                                             )}
                                          </p>
                                       </Col>
                                    </Row>
                                 </div>
                              ))}
                              <Row justify='end'>
                                 <Col span={8}>
                                    <div className='flex justify-between p-3'>
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
                                          <p className='font-semibold'>
                                             {t('total')}:{' '}
                                          </p>
                                       </div>
                                       <div className='space-y-1 [&>p]:text-end'>
                                          <p>
                                             {priceFormat(
                                                order.subTotal,
                                                isVnLang
                                             )}
                                          </p>
                                          <p>
                                             +
                                             {priceFormat(
                                                order.shippingCost || 0,
                                                isVnLang
                                             )}
                                          </p>
                                          <p>
                                             -
                                             {priceFormat(
                                                order.discount || 0,
                                                isVnLang
                                             )}
                                          </p>
                                          <p className='text-base font-semibold'>
                                             {priceFormat(
                                                order.total || 0,
                                                isVnLang
                                             )}
                                          </p>
                                       </div>
                                    </div>
                                 </Col>
                              </Row>
                           </div>
                        ),
                     }))}
                  />
                  <Pagination
                     page={data.page}
                     lastPage={data.lastPage}
                     total={data.total}
                     currentTotal={data.orders.length}
                     skip={skip}
                     setSkip={setSkip}
                     limit={7}
                  />
               </div>
            ) : (
               <p className='flex justify-center py-8 text-base'>
                  {t('dontOrder')}
               </p>
            )}
         </div>
      </>
   );
};

export default Orders;
