import 'chart.js/auto';
import moment from 'moment';
import { Col, Row } from 'antd';
import { Pie, Line } from 'react-chartjs-2';
import { useTranslation } from 'react-i18next';
import { useQueries } from '@tanstack/react-query';

import { RxSymbol } from 'react-icons/rx';
import { BsCartCheck, BsCheckLg } from 'react-icons/bs';
import { AiOutlineShoppingCart } from 'react-icons/ai';
import { LiaShippingFastSolid } from 'react-icons/lia';

import { PageTitle } from '@/components';

import { priceFormat } from '@/helpers';
import { orderApi, productApi, userApi } from '@/api';
import { FiUsers } from 'react-icons/fi';
import { RiAdminLine } from 'react-icons/ri';
import { GiSonicShoes } from 'react-icons/gi';
import { Link } from 'react-router-dom';

const labels = Array(6)
   .fill(0)
   .map((_, index) => {
      return moment().add(-index, 'day').format('DD-MM-YYYY');
   })
   .reverse();

function Overviews() {
   const { t, i18n } = useTranslation(['dashboard', 'mutual']);
   const isVnLang = i18n.language === 'vi';

   const [
      { data: productData },
      { data: productCount },
      { data: userCount },
      { data: orderCount },
      { data: orderChart },
      { data: orderAmount },
   ] = useQueries({
      queries: [
         {
            queryKey: ['bestSellerProduct'],
            queryFn: () =>
               productApi.getAll({
                  skip: 0,
                  limit: 3,
                  sort: 'sold:-1',
               }),
         },
         {
            queryKey: ['productCount'],
            queryFn: () => productApi.count(),
         },
         {
            queryKey: ['userCount'],
            queryFn: () => userApi.count(),
         },
         {
            queryKey: ['orderCount'],
            queryFn: () => orderApi.dashboardCount(),
         },
         {
            queryKey: ['orderChart'],
            queryFn: () => orderApi.dashboardChart(),
         },
         {
            queryKey: ['orderAmount'],
            queryFn: () => orderApi.dashboardAmount(),
         },
      ],
   });

   return (
      <>
         <PageTitle title='Overviews' />

         {orderAmount && orderCount && orderChart && (
            <div className='min-h-full mt-6 space-y-6'>
               <div>
                  <h2 className='text-[20px] font-medium'>
                     {t('overview.revenue')}
                  </h2>
                  <Row gutter={8}>
                     <Col
                        style={{
                           flexBasis: '25%',
                           width: '25%',
                        }}
                     >
                        <div className='flex items-center flex-col p-6 rounded-lg space-y-2 text-white  bg-[#0D9488] h-full'>
                           <AiOutlineShoppingCart size={28} />
                           <span className='text-base font-normal'>
                              {t('overview.todayOrder')}
                           </span>

                           <span className='text-2xl font-semibold'>
                              {priceFormat(
                                 Math.ceil(
                                    orderAmount.toDayOrder.reduce(
                                       (cur: number, item: any) =>
                                          cur + item.total,
                                       0
                                    )
                                 ),
                                 isVnLang
                              )}
                           </span>
                        </div>
                     </Col>
                     <Col
                        style={{
                           flexBasis: '25%',
                           width: '25%',
                        }}
                     >
                        <div className='flex items-center flex-col p-6 h-full rounded-lg space-y-2 text-white  bg-[#3B82F6]'>
                           <AiOutlineShoppingCart size={28} />
                           <span className='text-base font-normal'>
                              {t('overview.thisM')}
                           </span>

                           <span className='text-2xl font-semibold'>
                              {priceFormat(
                                 Math.ceil(orderAmount.thisMonthAmount),
                                 isVnLang
                              )}
                           </span>
                        </div>
                     </Col>
                     <Col
                        style={{
                           flexBasis: '25%',
                           width: '25%',
                        }}
                     >
                        <div className='flex items-center flex-col p-6 h-full rounded-lg space-y-2 text-white  bg-[#0891B2]'>
                           <AiOutlineShoppingCart size={28} />
                           <span className='text-base font-normal'>
                              {t('overview.lastM')}
                           </span>

                           <span className='text-2xl font-semibold'>
                              {priceFormat(
                                 Math.ceil(orderAmount.lastMonthAmount),
                                 isVnLang
                              )}
                           </span>
                        </div>
                     </Col>
                     <Col
                        style={{
                           flexBasis: '25%',
                           width: '25%',
                        }}
                     >
                        <div className='flex items-center flex-col p-6 h-full rounded-lg space-y-2 text-white  bg-[#059669]'>
                           <AiOutlineShoppingCart size={28} />
                           <span className='text-base font-normal'>
                              {t('overview.all')}
                           </span>

                           <span className='text-2xl font-semibold'>
                              {priceFormat(
                                 Math.ceil(orderAmount.totalAmount),
                                 isVnLang
                              )}
                           </span>
                        </div>
                     </Col>
                  </Row>
               </div>
               <div>
                  <h2 className='text-[20px] font-medium'>
                     {t('overview.info')}
                  </h2>
                  <Row gutter={8}>
                     <Col span={6}>
                        <div className='flex items-center space-x-4 p-5 rounded-lg h-22 bg-gray-200 text-wh dark:bg-[#1A1C23]'>
                           <div className='p-4 rounded-full bg-[#ED7D31]'>
                              <BsCartCheck size={20} color='#fff' />
                           </div>
                           <div className='flex flex-col'>
                              <span className='dark:text-gray-400 text-13'>
                                 {t('overview.totalOrder')}
                              </span>
                              <span className='text-2xl font-bold'>
                                 {orderCount.orders.reduce(
                                    (cur: number, item: any) =>
                                       item.count + cur,
                                    0
                                 )}
                              </span>
                           </div>
                        </div>
                     </Col>
                     <Col span={6}>
                        <div className='flex items-center space-x-4 p-5 rounded-lg h-22 bg-gray-200 text-wh dark:bg-[#1A1C23]'>
                           <div className='p-4 rounded-full bg-[#3B82F6]'>
                              <GiSonicShoes size={20} color='#fff' />
                           </div>
                           <div className='flex flex-col'>
                              <span className='dark:text-gray-400 text-13'>
                                 {t('overview.totalProduct')}
                              </span>
                              <span className='text-2xl font-bold'>
                                 {productCount?.count}
                              </span>
                           </div>
                        </div>
                     </Col>
                     <Col span={6}>
                        <div className='flex items-center space-x-4 p-5 rounded-lg h-22 bg-gray-200 text-wh dark:bg-[#1A1C23]'>
                           <div className='p-4 rounded-full bg-[#14B8A6]'>
                              <RiAdminLine size={20} color='#fff' />
                           </div>
                           <div className='flex flex-col'>
                              <span className='dark:text-gray-400 text-13'>
                                 {t('overview.totalAdmin')}
                              </span>
                              <span className='text-2xl font-bold'>
                                 {
                                    userCount?.find(
                                       (item) => item.role === 'admin'
                                    )?.count
                                 }
                              </span>
                           </div>
                        </div>
                     </Col>
                     <Col span={6}>
                        <div className='flex items-center space-x-4 p-5 rounded-lg h-22 bg-gray-200 text-wh dark:bg-[#1A1C23]'>
                           <div className='p-4 rounded-full bg-[#10B981]'>
                              <FiUsers size={20} color='#fff' />
                           </div>
                           <div className='flex flex-col'>
                              <span className='dark:text-gray-400 text-13'>
                                 {t('overview.totalCustomer')}
                              </span>
                              <span className='text-2xl font-bold'>
                                 {
                                    userCount?.find(
                                       (item) => item.role === 'customer'
                                    )?.count
                                 }
                              </span>
                           </div>
                        </div>
                     </Col>
                  </Row>
               </div>
               <div>
                  <h2 className='text-[20px] font-medium'>
                     {t('overview.orderInfo')}
                  </h2>
                  <Row gutter={8}>
                     <Col span={8}>
                        <Link
                           to='orders/pending'
                           className='flex items-center space-x-4 p-5 rounded-lg h-22 bg-gray-200 dark:bg-[#1A1C23]'
                        >
                           <div className='p-4 rounded-full bg-[#3B82F6]'>
                              <RxSymbol size={20} color='#fff' />
                           </div>
                           <div className='flex flex-col'>
                              <span className='dark:text-gray-400 text-13'>
                                 {t('overview.pending')}
                              </span>
                              <span className='text-2xl font-bold'>
                                 {
                                    orderCount.orders.find(
                                       (item) => item.status === 'pending'
                                    )?.count
                                 }
                              </span>
                           </div>
                        </Link>
                     </Col>
                     <Col span={8}>
                        <Link
                           to='orders/processing'
                           className='flex items-center space-x-4 p-5 rounded-lg h-22 bg-gray-200 dark:bg-[#1A1C23]'
                        >
                           <div className='p-4 rounded-full bg-[#14B8A6]'>
                              <LiaShippingFastSolid size={20} color='#fff' />
                           </div>
                           <div className='flex flex-col'>
                              <span className='dark:text-gray-400 text-13'>
                                 {t('overview.processing')}
                              </span>
                              <span className='text-2xl font-bold'>
                                 {
                                    orderCount.orders.find(
                                       (item) => item.status === 'processing'
                                    )?.count
                                 }
                              </span>
                           </div>
                        </Link>
                     </Col>
                     <Col span={8}>
                        <Link
                           to='orders/delivered'
                           className='flex items-center space-x-4 p-5 rounded-lg h-22 bg-gray-200 dark:bg-[#1A1C23]'
                        >
                           <div className='p-4 rounded-full bg-[#10B981]'>
                              <BsCheckLg size={20} color='#fff' />
                           </div>
                           <div className='flex flex-col'>
                              <span className='dark:text-gray-400 text-13'>
                                 {t('overview.delivered')}
                              </span>
                              <span className='text-2xl font-bold'>
                                 {
                                    orderCount.orders.find(
                                       (item) => item.status === 'delivered'
                                    )?.count
                                 }
                              </span>
                           </div>
                        </Link>
                     </Col>
                  </Row>
               </div>
               <Row gutter={8}>
                  <Col span={12}>
                     <div className='relative h-full p-4 flex items-end bg-gray-200 dark:bg-[#1A1C23] rounded-lg'>
                        <span className='absolute text-base top-4 left-4'>
                           {t('overview.weeklyOrder')}
                        </span>
                        {productData?.products && (
                           <Line
                              options={{
                                 responsive: isVnLang,
                                 plugins: {
                                    legend: {
                                       position: 'top' as const,
                                    },
                                 },
                              }}
                              data={{
                                 labels,
                                 datasets: [
                                    {
                                       label: t('order.aside'),
                                       data: labels.map((label) => {
                                          const count =
                                             orderChart?.orders.find(
                                                (item: any) =>
                                                   item.date === label
                                             )?.count || 0;
                                          return count;
                                       }),
                                    },
                                 ],
                              }}
                           />
                        )}
                     </div>
                  </Col>
                  <Col span={12}>
                     <div className='relative flex justify-center bg-gray-200 dark:bg-[#1A1C23] rounded-lg'>
                        <span className='absolute text-base top-4 left-4'>
                           {t('overview.bestSellingProduct')}
                        </span>
                        {productData?.products && (
                           <div className='py-8 '>
                              <Pie
                                 className='!w-[320px] !h-[320px] '
                                 data={{
                                    labels: productData.products.map(
                                       (item) => item.name
                                    ),
                                    datasets: [
                                       {
                                          label: t('label.sold', {
                                             ns: 'mutual',
                                          }),
                                          data: productData.products.map(
                                             (item) => item.sold
                                          ),
                                          backgroundColor: [
                                             'rgba(255, 99, 132, 0.2)',
                                             'rgba(54, 162, 235, 0.2)',
                                             'rgba(255, 206, 86, 0.2)',
                                          ],
                                          borderColor: [
                                             'rgba(255, 99, 132, 1)',
                                             'rgba(54, 162, 235, 1)',
                                             'rgba(255, 206, 86, 1)',
                                          ],
                                          borderWidth: 1,
                                       },
                                    ],
                                 }}
                              />
                           </div>
                        )}
                     </div>
                  </Col>
               </Row>
            </div>
         )}
      </>
   );
}

export default Overviews;
