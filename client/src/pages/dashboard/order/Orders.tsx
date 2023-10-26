import { orderApi } from '@/api';
import { Dropdown, Input, Pagination, Skeleton } from '@/components';
import PageTitle from '@/components/PageTitle';
import { dateFormat, notify, priceFormat } from '@/helpers';
import Header from '@/layouts/dashboard/components/Header';
import Table from '@/layouts/dashboard/components/Table';
import Title from '@/layouts/dashboard/components/Title';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Modal } from 'antd';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BiSearchAlt } from 'react-icons/bi';
import { BsThreeDots } from 'react-icons/bs';
import { Link, useNavigate } from 'react-router-dom';
import OrderDetail from './OrderDetail';
import { IOrder } from '@/types/orderType';
import { AiOutlineCheck, AiOutlineClose } from 'react-icons/ai';
import { ErrorResponse } from '@/types';

function Orders() {
   const [sort, setSort] = useState<any>({});
   const [params, setParams] = useState<any>({});
   const [skip, setSkip] = useState<number>(0);
   const [openModal, setOpenModal] = useState<boolean>(true);
   const [orderActive, setOrderActive] = useState<IOrder | null>(null);

   const { t } = useTranslation('dashboard');

   const { data, isLoading, refetch } = useQuery({
      queryKey: ['order', skip, params, sort],
      queryFn: () =>
         orderApi.getAll({
            ...params,
            skip: skip * 15,
            limit: 15,
            sort,
         }),
   });

   const updateOrderMutation = useMutation({
      mutationFn: ({ id, status }: { id: string; status: string }) =>
         orderApi.update(id, { status }),
      onSuccess: () => {
         refetch();
         notify('success', 'Update successful');
      },
      onError: (err: ErrorResponse) => {
         notify('error', err.message);
      },
   });

   const handleUpdateStatus = (
      id: string,
      status: 'pending' | 'processing' | 'delivered' | 'cancel'
   ) => {
      updateOrderMutation.mutate({ id, status });
   };

   return (
      <>
         <PageTitle title='Orders' />
         <Title title={t('title.order')} />
         <div className='flex flex-col mt-6'>
            <div className='mb-4 h-11'>
               <Input
                  type='text'
                  placeholder={t('placeholderSearch.searchByNamePhoneEmail')}
                  className='w-full h-full px-4'
                  // onKeyDown={(e) => e.key === 'Enter' && searchUser(e)}
               />
            </div>
            {isLoading ? (
               <Skeleton />
            ) : (
               <Table
                  heading={
                     <tr className='[&>*:not(:last-child)]:px-4 [&>*]:py-3'>
                        <td className='w-[10%]'>{t('table.date')}</td>
                        <td className='w-[18%]'>{t('table.customerName')}</td>
                        <td className='w-[15%]'>{t('table.phoneNumber')}</td>
                        <td className='w-[10%]'>{t('table.payment')}</td>
                        <td className='w-[15%]'>{t('table.totalAmout')}</td>
                        <td className='w-[12%]'>{t('status.status')}</td>
                        <td className='w-[15%] text-center'>
                           {t('table.actions')}
                        </td>
                        <td className='w-[5%]'></td>
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
                              <span>{dateFormat(order.createdAt)}</span>
                           </td>
                           <td>
                              <span>{order.user.name}</span>
                           </td>
                           <td>
                              <span>{order.phone}</span>
                           </td>
                           <td>
                              <span className='capitalize'>
                                 {order.paymentMethod}
                              </span>
                           </td>
                           <td>
                              <span>{priceFormat(order.total)}</span>
                           </td>
                           <td>
                              <span className='capitalize'>{order.status}</span>
                           </td>
                           <td className='flex justify-center '>
                              {order.status === 'pending' ? (
                                 <div className='flex w-full h-8 px-3 space-x-2 py-0.5'>
                                    <div
                                       className='flex items-center justify-center flex-1 bg-green-500 rounded cursor-pointer'
                                       onClick={() =>
                                          handleUpdateStatus(
                                             order._id,
                                             'processing'
                                          )
                                       }
                                    >
                                       <AiOutlineCheck />
                                    </div>
                                    <div
                                       className='flex items-center justify-center flex-1 bg-red-500 rounded cursor-pointer'
                                       onClick={() =>
                                          handleUpdateStatus(
                                             order._id,
                                             'cancel'
                                          )
                                       }
                                    >
                                       <AiOutlineClose />
                                    </div>
                                 </div>
                              ) : (
                                 <div className='px-3'>
                                    <Dropdown
                                       items={[
                                          {
                                             label: (
                                                <span
                                                   className='pl-1'
                                                   onClick={() =>
                                                      handleUpdateStatus(
                                                         order._id,
                                                         'delivered'
                                                      )
                                                   }
                                                >
                                                   Delivered
                                                </span>
                                             ),
                                          },
                                          {
                                             label: (
                                                <span
                                                   className='pl-1'
                                                   onClick={() =>
                                                      handleUpdateStatus(
                                                         order._id,
                                                         'cancel'
                                                      )
                                                   }
                                                >
                                                   Cancel
                                                </span>
                                             ),
                                          },
                                       ]}
                                    >
                                       <Input
                                          className='w-full h-8 text-xs placeholder:capitalize !cursor-pointer rounded-md appearance bg-[#24262D] border-none'
                                          placeholder={order.status}
                                          readOnly
                                       />
                                    </Dropdown>
                                 </div>
                              )}
                           </td>
                           <td>
                              <div
                                 className='flex items-center justify-center cursor-pointer'
                                 title='View invoice'
                                 onClick={() => {
                                    setOrderActive(order);
                                    setOpenModal(true);
                                 }}
                              >
                                 <BiSearchAlt size={20} />
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
               <Modal
                  open={openModal}
                  width='70vw'
                  footer={null}
                  title={null}
                  centered
                  closeIcon={<AiOutlineClose color='#fff' />}
                  className='bg-white dark:bg-[#1A1C23] text-black dark:text-white !pb-0 rounded-lg'
                  onCancel={() => setOpenModal(false)}
               >
                  <OrderDetail
                     order={orderActive}
                     handleUpdateStatus={handleUpdateStatus}
                  />
               </Modal>
            )}
         </div>
      </>
   );
}

export default Orders;
