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
import { BiSearch } from 'react-icons/bi';
import { Link } from 'react-router-dom';

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
                        <Col span={1}></Col>
                        <Col span={4}>
                           <p className='px-4 py-3 text-15'>{t('coupon')}</p>
                        </Col>
                        <Col span={4}>
                           <p className='px-4 py-3 text-15'>{t('total')}</p>
                        </Col>
                        <Col span={4}>
                           <p className='px-4 py-3 text-15'>
                              {t('status.status', { ns: 'mutual' })}
                           </p>
                        </Col>

                        <Col span={3}></Col>
                     </Row>
                  </div>
                  {data.orders.map((order, index) => {
                     const isNew =
                        moment(order.createdAt).format('DDMMYY') ===
                        moment().format('DDMMYY');

                     return (
                        <div
                           className={twMerge(
                              'border-t hover:bg-[rgba(0,0,0,0.024)] duration-150',
                              order.status === 'cancel' &&
                                 'opacity-50 line-through'
                           )}
                           key={index}
                        >
                           <Row>
                              <Col span={3}>
                                 <p className='relative p-4'>
                                    {'#' + order._id.slice(-6, -1)}
                                    {isNew && (
                                       <span className='absolute top-2 right-4 px-1.5 py-0.5 rounded rotate-6 text-xs bg-red-400 border'>
                                          {t('new', { ns: 'mutual' })}
                                       </span>
                                    )}
                                 </p>
                              </Col>
                              <Col span={5}>
                                 <p className='p-4'>
                                    {moment(order.createdAt).format(
                                       'DD/MM YYYY HH:mm'
                                    )}
                                 </p>
                              </Col>
                              <Col span={1}></Col>
                              <Col span={4}>
                                 <p className='p-4 capitalize'>
                                    {order?.coupon?.code}
                                 </p>
                              </Col>
                              <Col span={4}>
                                 <p className='p-4 font-semibold capitalize'>
                                    {priceFormat(order.total, isVnLang)}
                                 </p>
                              </Col>
                              <Col span={4}>
                                 <p className='p-4 capitalize'>
                                    {t(`status.${order.status as Status}`, {
                                       ns: 'mutual',
                                    })}
                                 </p>
                              </Col>

                              <Col span={3}>
                                 <div className='flex items-center justify-center h-full text-[#45a9f0]'>
                                    <Link to={order._id}>
                                       {t('viewDetail')}
                                    </Link>
                                 </div>
                              </Col>
                           </Row>
                        </div>
                     );
                  })}

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
