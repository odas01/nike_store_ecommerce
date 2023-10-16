import { dateFormat, priceFormat } from '@/helpers';
import Table from '@/layouts/dashboard/components/Table';
import { IOrder } from '@/types/order';
import { Col, Row } from 'antd';
import React, { FC } from 'react';
import { AiOutlineCheck, AiOutlineClose } from 'react-icons/ai';

interface OrderDetailProps {
   order: IOrder;
   handleUpdateStatus: (id: string, status: string) => void;
}

const OrderDetail: FC<OrderDetailProps> = ({ order, handleUpdateStatus }) => {
   return (
      <div className='relative flex flex-col h-full px-4 py-2'>
         <Row gutter={24}>
            <Col span={9}>
               <div className='flex flex-col h-full font-normal'>
                  <h2 className='text-xl'>
                     INVOICE
                     <span className='ml-2 text-[#9a9a9a]'>
                        ({dateFormat(order.createdAt)})
                     </span>
                  </h2>
                  <div className='flex items-center mt-2 mb-5 space-x-2'>
                     <span>Status: </span>
                     <span className='px-1.5 py-0.5 text-xs bg-red-400 rounded capitalize'>
                        {order.status}
                     </span>
                  </div>
                  <Row>
                     <Col span={5}>
                        <div className='flex flex-col space-y-1'>
                           <span className='text-[#9e9e9e]'>Name: </span>
                           <span className='text-[#9e9e9e]'>Phone: </span>
                           <span className='text-[#9e9e9e]'>Email: </span>
                           <span className='text-[#9e9e9e]'>Address: </span>
                           <span className='text-[#9e9e9e]'>Message: </span>
                        </div>
                     </Col>
                     <Col span={19}>
                        <div className='flex flex-col space-y-1'>
                           <span> {order.user.name}</span>
                           <span> {order.phone}</span>
                           <span> {order.user.email}</span>
                           <span> {order.address} </span>
                           <span> "{order.message || 'No message'}" </span>
                        </div>
                     </Col>
                  </Row>
               </div>
            </Col>
            <Col span={15}>
               <div className='flex flex-col space-y-2 pt-9'>
                  <span>Danh sách sản phẩm:</span>
                  <div className='max-h-[300px] overflow-hidden overflow-y-scroll'>
                     <Table
                        heading={
                           <tr className='[&>td]:py-2 text-xs'>
                              <td className='w-[10%]'></td>
                              <td className='w-[46%]'>Product name</td>
                              <td className='w-[17%]'>Price</td>
                              <td className='text-end w-[17%]'>Amout</td>
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
                                       {item.name} {item.name}
                                    </span>
                                 </div>
                              </td>
                              <td>{priceFormat(item.price)}</td>
                              <td className='text-end'>
                                 {priceFormat(item.price * item.qty)}
                              </td>
                           </tr>
                        ))}
                     </Table>
                  </div>

                  {/* <table className='border border-gray-400 dark:border-[#343434] bg-white dark:bg-[#1A1C23]'>
                     <thead className='table_db_thead'>
                        <tr>
                           <td>No</td>
                           <td>Product name</td>
                           <td>Quantity</td>
                           <td>Price</td>
                           <td>Total</td>
                        </tr>
                     </thead>
                     <tbody></tbody>
                  </table> */}
               </div>
            </Col>
         </Row>

         <div className='flex justify-between bg-[#2a2b30] rounded p-4 mt-12 mb-6'>
            <div className='flex flex-col mr-8'>
               <span className='mb-1 text-sm font-semibold text-gray-500 uppercase'>
                  Payment method
               </span>
               <span className='capitalize'>{order.paymentMethod}</span>
            </div>
            <div className='flex flex-col mr-12'>
               <span className='mb-1 text-sm font-semibold text-gray-500 uppercase'>
                  Shipping cost
               </span>
               <span>{priceFormat(order?.shippingCost || 0)}</span>
            </div>
            <div className='flex flex-col mr-12'>
               <span className='mb-1 text-sm font-semibold text-gray-500 uppercase'>
                  Discount
               </span>
               <span>{priceFormat(order?.discount || 0)}</span>
            </div>
            <div className='flex flex-col items-end mb-1'>
               <span className='mb-1 text-sm font-semibold text-gray-500 uppercase'>
                  Total amount
               </span>
               <span className='text-xl font-semibold text-red-400'>
                  {priceFormat(order.total)}
               </span>
            </div>
         </div>
         <div className='flex items-center justify-end space-x-3'>
            <div
               className='flex items-center px-3 py-1.5 space-x-2 text-white bg-red-500 rounded cursor-pointer'
               onClick={() => handleUpdateStatus(order._id, 'cancel')}
            >
               <AiOutlineClose />
               <span>Cancel </span>
            </div>
            <div
               className='flex items-center px-3 py-1.5 space-x-2 text-white bg-green-500 rounded cursor-pointer'
               onClick={() => handleUpdateStatus(order._id, 'processing')}
            >
               <AiOutlineCheck />
               <span>Approve </span>
            </div>
         </div>
      </div>
   );
};

export default OrderDetail;
