import moment from 'moment';
import { Modal } from 'antd';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery } from '@tanstack/react-query';

import { FaCheck } from 'react-icons/fa';
import { RxShadowNone } from 'react-icons/rx';
import { IoIosRefresh } from 'react-icons/io';
import { BiSearchAlt, BiSort } from 'react-icons/bi';
import { MdOutlineLocalShipping } from 'react-icons/md';
import { AiOutlineCheck, AiOutlineClose } from 'react-icons/ai';

import OrderDetail from './OrderDetail';
import PageTitle from '@/components/PageTitle';
import Table from '@/layouts/dashboard/components/Table';
import Title from '@/layouts/dashboard/components/Title';
import { Button, Dropdown, Input, Loading, Pagination } from '@/components';

import { orderApi } from '@/api';
import { IOrder } from '@/types/order';
import { notify, priceFormat } from '@/helpers';

type Params = {
   search: string;
   paymentMethod: string;
   status: string;
};

type Status = 'pending' | 'processing' | 'delivered' | 'cancel';

const DEFAULT_LIMIT = import.meta.env.VITE_APP_LIMIT || 15;

const Orders: React.FC<{
   status: Status;
}> = ({ status }) => {
   const [sort, setSort] = useState<any>('createdAt:-1');
   const [params, setParams] = useState<Partial<Params>>({});
   const [skip, setSkip] = useState<number>(0);
   const [openModal, setOpenModal] = useState<string | null>(null);
   const [orderActive, setOrderActive] = useState<IOrder | null>(null);

   const { t, i18n } = useTranslation(['dashboard', 'mutual']);
   const isVnLang = i18n.language === 'vi';
   const { data, isLoading, refetch } = useQuery({
      queryKey: ['orders', skip, params, sort, status],
      queryFn: () =>
         orderApi.getAll({
            ...params,
            skip: skip,
            limit: DEFAULT_LIMIT,
            sort,
            status,
         }),
   });

   console.log(skip);

   const updateOrderMutation = useMutation({
      mutationFn: ({ id, status }: { id: string; status: string }) =>
         orderApi.update(id, { status, paid: status === 'delivered' }),
      onSuccess: ({ message }) => {
         refetch();
         notify('success', isVnLang ? message.vi : message.en);
      },
      onError: ({ message }) => {
         notify('success', isVnLang ? message.vi : message.en);
      },
   });

   const handleUpdateStatus = (
      id: string,
      status: 'pending' | 'processing' | 'delivered' | 'cancel'
   ) => {
      updateOrderMutation.mutate({ id, status });

      setOpenModal(null);
      setOrderActive(null);
   };

   return (
      <>
         <PageTitle title='Orders' />
         <Title title={t(`order.title.${status as Status}`)} />
         <div className='flex flex-col mt-6'>
            <div className='flex mb-4 space-x-4 h-11'>
               <Input
                  type='text'
                  placeholder={t('placeholderSearch.searchByPhone')}
                  className='w-full h-full px-4'
                  onKeyDown={(e) =>
                     e.key === 'Enter' &&
                     setParams({ ...params, search: e.currentTarget.value })
                  }
               />
               <Dropdown
                  items={[
                     {
                        label: (
                           <p
                              className='px-3 py-1'
                              onClick={() =>
                                 setParams({ ...params, paymentMethod: 'cash' })
                              }
                           >
                              {t('overview.cash')}
                           </p>
                        ),
                     },
                     {
                        label: (
                           <p
                              className='px-3 py-1'
                              onClick={() =>
                                 setParams({
                                    ...params,
                                    paymentMethod: 'paypal',
                                 })
                              }
                           >
                              Paypal
                           </p>
                        ),
                     },
                     {
                        label: (
                           <p
                              className='px-3 py-1'
                              onClick={() =>
                                 setParams({
                                    ...params,
                                    paymentMethod: 'paypal',
                                 })
                              }
                           >
                              VnPay
                           </p>
                        ),
                     },
                  ]}
                  children={
                     <Input
                        placeholder={t('label.payment', { ns: 'mutual' })}
                        className='h-full capitalize appearance placeholder:normal-case focus:cursor-pointer'
                        value={params.paymentMethod}
                        readOnly
                     />
                  }
               />
               <Button
                  onClick={() => {
                     setSort({});
                     setParams({});
                  }}
                  className='h-full w-[20%] flex items-center justify-center space-x-1'
               >
                  <IoIosRefresh />
                  <span>{t('action.refresh', { ns: 'mutual' })}</span>
               </Button>
            </div>
            {isLoading ? (
               <Loading />
            ) : (
               <Table
                  heading={
                     <tr className='[&>*:not(:last-child)]:px-4 [&>*]:py-3'>
                        <td className='w-[5%]'>ID</td>
                        <td className='w-[13%]'>
                           {t('label.date', {
                              ns: 'mutual',
                           })}
                        </td>
                        <td className='w-[15%]'>{t('order.customerName')}</td>
                        <td className='w-[12%]'>{t('coupon.code')}</td>
                        <td className='w-[13%]'>
                           <div
                              className='flex items-center w-full space-x-1 cursor-pointer'
                              onClick={() => {
                                 const arr = sort.split(':');
                                 if (arr[0] !== 'total') {
                                    setSort('total:-1');
                                 } else {
                                    setSort(
                                       arr[1] === '1' ? 'total:-1' : 'total:1'
                                    );
                                 }
                              }}
                           >
                              <span>{t('order.totalAmout')}</span>
                              <BiSort />
                           </div>
                        </td>{' '}
                        <td className='w-[18%]'>
                           {t('label.address', { ns: 'mutual' })}
                        </td>
                        <td className='w-[12%]'>
                           <span>
                              {t('label.payment', {
                                 ns: 'mutual',
                              })}{' '}
                           </span>
                        </td>
                        <td className='w-[12%] text-end'>
                           <span>
                              {t('label.action', {
                                 ns: 'mutual',
                              })}{' '}
                           </span>
                        </td>
                     </tr>
                  }
                  pagination={
                     data &&
                     data.orders.length > 0 && (
                        <Pagination
                           page={data.page}
                           lastPage={data.lastPage}
                           total={data.total}
                           currentTotal={data.orders.length}
                           skip={skip}
                           setSkip={setSkip}
                        />
                     )
                  }
               >
                  {data && data.orders.length > 0 ? (
                     data.orders?.map((order, index) => (
                        <tr key={index} className='[&>td:not(:last-child)]:p-4'>
                           <td>
                              <span>{'#' + order._id.slice(-6, -1)}</span>
                           </td>
                           <td>
                              <span>
                                 {moment(order.createdAt).format(
                                    'DD/MM YY | HH:mm'
                                 )}
                              </span>
                           </td>
                           <td>
                              <div className='flex flex-col [&>span]:line-clamp-1 space-y-1'>
                                 <span>{order.user.name}</span>
                                 <span>{order.phone}</span>
                              </div>
                           </td>
                           <td>
                              {order?.coupon ? (
                                 <div className='flex flex-col [&>span]:line-clamp-1 space-y-1'>
                                    <span>{order.coupon.code}</span>
                                    <span>
                                       {order.coupon.type === 'percent'
                                          ? order.coupon.value + '%'
                                          : priceFormat(
                                               order.coupon.value,
                                               isVnLang
                                            )}
                                    </span>
                                 </div>
                              ) : (
                                 <RxShadowNone />
                              )}
                           </td>
                           <td>
                              <span>{priceFormat(order.total, isVnLang)}</span>
                           </td>
                           <td>
                              <span className='line-clamp-2'>
                                 {order.address}
                              </span>
                           </td>
                           <td>
                              <div className='flex flex-col [&>span]:line-clamp-1 space-y-1 text-xs'>
                                 <span className='capitalize'>
                                    {order.paymentMethod === 'cash'
                                       ? t('cash', { ns: 'mutual' })
                                       : order.paymentMethod}
                                 </span>
                                 <span>
                                    {t(
                                       !!order.paid
                                          ? 'status.paid'
                                          : 'status.unpaid',
                                       { ns: 'mutual' }
                                    )}
                                 </span>
                              </div>
                           </td>
                           <td>
                              <div className='flex items-center justify-end space-x-2'>
                                 {status === 'pending' && (
                                    <div
                                       className='flex items-center justify-center px-2.5 py-1.5 bg-green-500 rounded-sm cursor-pointer'
                                       onClick={() => {
                                          setOrderActive(order);
                                          setOpenModal('checkProsessing');
                                       }}
                                    >
                                       <FaCheck size={14} color='#fff' />
                                    </div>
                                 )}
                                 {status === 'processing' && (
                                    <div
                                       className='flex items-center justify-center px-2.5 py-1.5 bg-green-500 rounded-sm cursor-pointer'
                                       onClick={() => {
                                          setOrderActive(order);
                                          setOpenModal('checkDelivered');
                                       }}
                                    >
                                       <MdOutlineLocalShipping
                                          size={14}
                                          color='#fff'
                                       />
                                    </div>
                                 )}
                                 {(status === 'pending' ||
                                    status === 'processing') && (
                                    <div
                                       className='flex items-center justify-center px-2.5 py-1.5 bg-red-500 rounded-sm cursor-pointer'
                                       onClick={() => {
                                          setOrderActive(order);
                                          setOpenModal('checkCancel');
                                       }}
                                    >
                                       <AiOutlineClose size={14} color='#fff' />
                                    </div>
                                 )}
                                 <div
                                    className='flex items-center justify-center px-2.5 py-1.5 border border-gray-400 dark:border-gray-600 rounded-sm cursor-pointer'
                                    onClick={() => {
                                       setOrderActive(order);
                                       setOpenModal('view');
                                    }}
                                 >
                                    <BiSearchAlt size={14} />
                                 </div>
                              </div>
                           </td>
                        </tr>
                     ))
                  ) : (
                     <tr>
                        <td className='py-8 text-base text-center' colSpan={7}>
                           No results
                        </td>
                     </tr>
                  )}
               </Table>
            )}
            {orderActive && (
               <>
                  <Modal
                     open={!!openModal && openModal === 'view'}
                     width='70vw'
                     footer={null}
                     title={null}
                     centered
                     closeIcon={
                        <div className='text-black dark:text-white'>
                           <AiOutlineClose color='inherit' />
                        </div>
                     }
                     className='bg-white dark:bg-[#1A1C23] text-black dark:text-white !pb-0 rounded-lg'
                     onCancel={() => setOpenModal(null)}
                  >
                     <OrderDetail
                        order={orderActive}
                        handleUpdateStatus={handleUpdateStatus}
                        setOpenModal={setOpenModal}
                     />
                  </Modal>
                  <Modal
                     open={!!openModal && openModal !== 'view'}
                     footer={null}
                     title={null}
                     centered
                     closeIcon={
                        <div className='text-black dark:text-white'>
                           <AiOutlineClose color='inherit' />
                        </div>
                     }
                     className='bg-white dark:bg-[#1A1C23] text-black dark:text-white p-4 rounded-lg'
                     onCancel={() => setOpenModal(null)}
                  >
                     <h2 className='mb-8 text-xl'>
                        {openModal === 'checkProsessing'
                           ? 'Xác nhận duyệt đơn'
                           : openModal === 'checkDelivered'
                           ? 'Xác nhận đã giao'
                           : 'Xác nhận hủy đơn'}
                     </h2>
                     <div className='flex items-center justify-end space-x-2'>
                        {openModal === 'checkCancel' && (
                           <div
                              className='flex items-center px-2.5 py-1.5 space-x-2 text-white bg-red-500 rounded-sm cursor-pointer'
                              onClick={() =>
                                 handleUpdateStatus(orderActive._id, 'cancel')
                              }
                           >
                              <AiOutlineClose color='inherit' />
                              <span>{t('order.cancel')} </span>
                           </div>
                        )}

                        {openModal === 'checkProsessing' && (
                           <div
                              className='flex items-center px-2.5 py-1.5 space-x-2 text-white bg-green-500 rounded-sm cursor-pointer'
                              onClick={() =>
                                 handleUpdateStatus(
                                    orderActive._id,
                                    'processing'
                                 )
                              }
                           >
                              <AiOutlineCheck color='#fff' />
                              <span>{t('order.approve')} </span>
                           </div>
                        )}
                        {openModal === 'checkDelivered' && (
                           <div
                              className='flex items-center px-2 py-1 space-x-2 text-white bg-green-500 rounded-sm cursor-pointer'
                              onClick={() =>
                                 handleUpdateStatus(
                                    orderActive._id,
                                    'delivered'
                                 )
                              }
                           >
                              <AiOutlineCheck color='#fff' />
                              <span>{t('order.approve')} </span>
                           </div>
                        )}
                     </div>
                  </Modal>
               </>
            )}
         </div>
      </>
   );
};

export default Orders;
