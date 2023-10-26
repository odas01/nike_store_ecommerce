import { orderApi } from '@/api';
import { Pagination } from '@/components';
import { dateFormat, priceFormat } from '@/helpers';
import Table from '@/layouts/dashboard/components/Table';
import authStore from '@/stores/authStore';
import { useQuery } from '@tanstack/react-query';
import { Col, Collapse, Row, Spin } from 'antd';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AiOutlineMinus, AiOutlinePlus } from 'react-icons/ai';
import { FcShipped } from 'react-icons/fc';
import { MdOutlineLocalShipping, MdPendingActions } from 'react-icons/md';
import { twMerge } from 'tailwind-merge';

const colorStatus = [
   {
      status: 'pending',
      color: '#A2FF86',
   },
   {
      status: 'processing',
      color: '#DF2E38',
   },
   {
      status: 'delivered',
      color: '#1A5D1A',
   },
];

const Orders = () => {
   const { currentUser } = authStore();
   const [skip, setSkip] = useState<number>(0);
   const { data, isLoading } = useQuery({
      queryKey: ['orders', currentUser?._id, skip],
      queryFn: () =>
         orderApi.getAll({
            skip: skip * 15,
            limit: 15,
            user: currentUser?._id,
         }),
      enabled: !!currentUser,
   });

   const { t, i18n } = useTranslation(['home', 'dashboard']);
   const isVnLang = i18n.language === 'vi';

   return (
      <div>
         <h2 className='mb-4 text-xl font-semibold'>{t('orders')}</h2>

         {isLoading && currentUser ? (
            <div className='absolute top-0 right-0 z-10 flex items-center justify-center w-full h-full'>
               <Spin size='large' />
            </div>
         ) : data && data.orders.length > 0 ? (
            <div className='border rounded-lg'>
               <div className='bg-[#F3F4F6]'>
                  <Row>
                     <Col span={5}>
                        <p className='px-4 py-3 text-15'>
                           {t('table.date', { ns: 'dashboard' })}
                        </p>
                     </Col>
                     <Col span={8}></Col>
                     <Col span={4}>
                        <p className='px-4 py-3 capitalize text-15'>
                           {t('method')}
                        </p>
                     </Col>
                     <Col span={4}>
                        <p className='px-4 py-3 capitalize text-15'>
                           {t('table.date', { ns: 'dashboard' })}
                        </p>
                     </Col>
                     <Col span={3}>
                        <p className='px-4 py-3 capitalize text-end text-15'>
                           {t('status.status', { ns: 'dashboard' })}
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
                              <Col span={5}>
                                 <p className='px-4 py-3'>
                                    {dateFormat(order.createdAt)}
                                 </p>
                              </Col>
                              <Col span={8}></Col>
                              <Col span={4}>
                                 <p className='px-4 py-3 capitalize'>
                                    {order.paymentMethod}
                                 </p>
                              </Col>
                              <Col span={4}>
                                 <p className='px-4 py-3 font-semibold capitalize'>
                                    {priceFormat(order.total, isVnLang)}
                                 </p>
                              </Col>
                              <Col span={3}>
                                 <p
                                    className='px-4 py-3 capitalize text-end'
                                    style={{
                                       color: colorStatus.find(
                                          (item) => item.status === order.status
                                       )?.color,
                                    }}
                                 >
                                    {order.status}
                                 </p>
                              </Col>
                           </Row>
                        </div>
                     ),
                     children: (
                        <div className='border-t bg-[#F3F4F6]'>
                           {order.products.map((item, index) => (
                              <div key={index} className='border-gray-200'>
                                 <Row className='flex items-center' key={index}>
                                    <Col span={13}></Col>
                                    <Col xl={6}>
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
                                       <p>Sub total: </p>
                                       <p>Shipping cost: </p>
                                       <p>Discount: </p>
                                       <p className='font-semibold'>Total: </p>
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
                                       <p className='font-semibold text-base'>
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
                  limit={15}
               />
            </div>
         ) : (
            <p className='flex justify-center py-8 text-base'>
               {t('dontOrder')}
            </p>
         )}
      </div>
   );
};

export default Orders;
