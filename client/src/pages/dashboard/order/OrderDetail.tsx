import { dateFormat, priceFormat } from '@/helpers';
import Table from '@/layouts/dashboard/components/Table';
import { IOrder } from '@/types/orderType';
import { Col, Row } from 'antd';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { AiOutlineCheck, AiOutlineClose } from 'react-icons/ai';

type Status = 'pending' | 'processing' | 'delivered' | 'cancel';

interface OrderDetailProps {
   order: IOrder;
   handleUpdateStatus: (id: string, status: Status) => void;
}

const OrderDetail: FC<OrderDetailProps> = ({ order, handleUpdateStatus }) => {
   const { t, i18n } = useTranslation(['dashboard', 'mutual']);
   const isVnLang = i18n.language === 'vi';

   return (
      <div className='relative flex flex-col h-full px-4 py-2'>
         <Row gutter={24}>
            <Col span={10}>
               <div className='flex flex-col h-full font-normal'>
                  <h2 className='text-xl uppercase'>
                     {t('order.invoice')}
                     <span className='ml-2 text-[#9a9a9a]'>
                        ({dateFormat(order.createdAt)})
                     </span>
                  </h2>
                  <div className='flex items-center mt-2 mb-8 space-x-2'>
                     <span>{t('status.status', { ns: 'mutual' })}: </span>
                     <span className='px-1.5 py-0.5 text-xs bg-red-400 rounded'>
                        {t(`status.${order.status as Status}`, {
                           ns: 'mutual',
                        })}
                     </span>
                  </div>
                  <Row>
                     <Col span={8}>
                        <div className='flex flex-col space-y-1'>
                           <span className='text-[#9e9e9e]'>
                              {t('label.name', { ns: 'mutual' })}:{' '}
                           </span>
                           <span className='text-[#9e9e9e]'>
                              {' '}
                              {t('label.phone', { ns: 'mutual' })}:{' '}
                           </span>
                           <span className='text-[#9e9e9e]'>Email: </span>
                           <span className='text-[#9e9e9e]'>
                              {' '}
                              {t('label.address', { ns: 'mutual' })}:{' '}
                           </span>
                           <span className='text-[#9e9e9e]'>
                              {t('label.message', { ns: 'mutual' })}:{' '}
                           </span>
                        </div>
                     </Col>
                     <Col span={16}>
                        <div className='flex flex-col space-y-1'>
                           <span> {order.user.name}</span>
                           <span> {order.phone}</span>
                           <span> {order.user.email}</span>
                           <span> {order.address} </span>
                           <span> {order.message} </span>
                        </div>
                     </Col>
                  </Row>
               </div>
            </Col>
            <Col span={14}>
               <div className='flex flex-col space-y-2 pt-9'>
                  <span>{t('product.title')}:</span>
                  <div className='max-h-[300px] overflow-hidden overflow-y-scroll'>
                     <Table
                        heading={
                           <tr className='[&>td]:py-2 text-xs'>
                              <td className='w-[10%]'></td>
                              <td className='w-[46%]'>
                                 {t('label.name', { ns: 'mutual' })}
                              </td>
                              <td className='w-[17%]'>
                                 {t('label.price', { ns: 'mutual' })}
                              </td>
                              <td className='text-end w-[17%]'>
                                 {t('label.total', { ns: 'mutual' })}
                              </td>
                           </tr>
                        }
                     >
                        {order.products.map((item, index) => (
                           <tr key={index} className='[&>td]:py-3 text-[13px]'>
                              <td>x{item.qty}</td>
                              <td>
                                 <div className='flex items-center pr-8 space-x-2'>
                                    <img
                                       src={item.thumbnail}
                                       className='w-6 rounded-full aspect-square'
                                       alt={item.name}
                                    />
                                    <span className='text-sm line-clamp-1'>
                                       {item.name}
                                    </span>
                                 </div>
                              </td>
                              <td>{priceFormat(item.price, isVnLang)}</td>
                              <td className='text-end'>
                                 {priceFormat(item.price * item.qty, isVnLang)}
                              </td>
                           </tr>
                        ))}
                     </Table>
                  </div>
               </div>
            </Col>
         </Row>

         <div className='flex justify-between bg-[#2a2b30] rounded p-4 mt-20 mb-6'>
            <div className='flex flex-col mr-8'>
               <span className='mb-1 text-sm font-semibold text-gray-500 uppercase'>
                  {t('order.paymentMethod', { ns: 'mutual' })}
               </span>
               <span className='capitalize'>{order.paymentMethod}</span>
            </div>
            <div className='flex flex-col mr-12'>
               <span className='mb-1 text-sm font-semibold text-gray-500 uppercase'>
                  {t('order.shippingCost', { ns: 'mutual' })}
               </span>
               <span>{priceFormat(order?.shippingCost || 0, isVnLang)}</span>
            </div>
            <div className='flex flex-col mr-12'>
               <span className='mb-1 text-sm font-semibold text-gray-500 uppercase'>
                  {t('label.discount', { ns: 'mutual' })}
               </span>
               <span>{priceFormat(order?.discount || 0, isVnLang)}</span>
            </div>
            <div className='flex flex-col items-end mb-1'>
               <span className='mb-1 text-sm font-semibold text-gray-500 uppercase'>
                  {t('order.totalAmout')}
               </span>
               <span className='text-xl font-semibold text-red-400'>
                  {priceFormat(order.total, isVnLang)}
               </span>
            </div>
         </div>
         {order.status === 'pending' && (
            <div className='flex items-center justify-end space-x-3'>
               <div
                  className='flex items-center px-3 py-1.5 space-x-2 text-white bg-red-500 rounded cursor-pointer'
                  onClick={() => handleUpdateStatus(order._id, 'cancel')}
               >
                  <AiOutlineClose />
                  <span>{t('order.cancel')} </span>
               </div>
               <div
                  className='flex items-center px-3 py-1.5 space-x-2 text-white bg-green-500 rounded cursor-pointer'
                  onClick={() => handleUpdateStatus(order._id, 'processing')}
               >
                  <AiOutlineCheck />
                  <span>{t('order.approve')} </span>
               </div>
            </div>
         )}
      </div>
   );
};

export default OrderDetail;
