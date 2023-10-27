import { PageTitle } from '@/components';
import 'chart.js/auto';
import Title from '@/layouts/dashboard/components/Title';
import { Col, Row } from 'antd';
import { TiMessages } from 'react-icons/ti';
import { Pie, Bar, Line } from 'react-chartjs-2';
import { useQueries, useQuery } from '@tanstack/react-query';
import { orderApi, overviewApi, productApi } from '@/api';
import { TbBorderSides } from 'react-icons/tb';
import { AiOutlineCheck, AiOutlineShoppingCart } from 'react-icons/ai';
import { LiaShippingFastSolid } from 'react-icons/lia';
import { RxSymbol } from 'react-icons/rx';
import { BsCheckLg } from 'react-icons/bs';
import moment from 'moment';
import { t } from 'i18next';
import { priceFormat } from '@/helpers';
import { useTranslation } from 'react-i18next';

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
      { data: productData, isLoading: productLoading },
      { data: orderCount, isLoading: countLoading },
      { data: orderChart, isLoading: chartLoading },
      { data: orderAmount, isLoading: amountLoading },
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
         <Title title='Overviews' />
         {orderAmount && orderCount && orderChart && (
            <div className='min-h-full mt-6 space-y-6'>
               <Row gutter={8}>
                  <Col
                     style={{
                        flexBasis: '20%',
                        width: '20%',
                     }}
                  >
                     <div className='flex items-center flex-col p-6 rounded-lg space-y-2 dark:bg-[#0D9488]'>
                        <AiOutlineShoppingCart size={28} />
                        <span className='text-base font-normal'>
                           {t('overview.todayOrder')}
                        </span>

                        <span className='text-2xl font-semibold'>
                           {priceFormat(
                              orderAmount.toDayOrder.reduce(
                                 (cur: number, item: any) => cur + item.total,
                                 0
                              ),
                              isVnLang
                           )}
                        </span>
                        <div className='flex space-x-12 font-light text-13'>
                           <div className='flex flex-col items-center'>
                              <span>{t('overview.cash')}:</span>
                              <span>
                                 {priceFormat(
                                    orderAmount.toDayOrder.find(
                                       (item: any) => item.method === 'cash'
                                    )?.total || 0,
                                    isVnLang
                                 )}
                              </span>
                           </div>
                           <div className='flex flex-col items-center'>
                              <span>Paypal:</span>
                              <span>
                                 {priceFormat(
                                    orderAmount.toDayOrder.find(
                                       (item: any) => item.method === 'paypal'
                                    )?.total || 0,
                                    isVnLang
                                 )}
                              </span>
                           </div>
                        </div>
                     </div>
                  </Col>
                  <Col
                     style={{
                        flexBasis: '20%',
                        width: '20%',
                     }}
                  >
                     <div className='flex items-center flex-col p-6 rounded-lg space-y-2 dark:bg-[#FB923C]'>
                        <AiOutlineShoppingCart size={28} />
                        <span className='text-base font-normal'>
                           {t('overview.yesdOrder')}
                        </span>

                        <span className='text-2xl font-semibold'>
                           {priceFormat(
                              orderAmount.yesterdayOrder.reduce(
                                 (cur: number, item: any) => cur + item.total,
                                 0
                              ),
                              isVnLang
                           )}
                        </span>
                        <div className='flex space-x-12 font-light text-13'>
                           <div className='flex flex-col items-center'>
                              <span>{t('overview.cash')}:</span>
                              <span>
                                 {priceFormat(
                                    orderAmount.yesterdayOrder.find(
                                       (item: any) => item.method === 'cash'
                                    )?.total || 0,
                                    isVnLang
                                 )}
                              </span>
                           </div>
                           <div className='flex flex-col items-center'>
                              <span>Paypal:</span>
                              <span>
                                 {priceFormat(
                                    orderAmount.yesterdayOrder.find(
                                       (item: any) => item.method === 'paypal'
                                    )?.total || 0,
                                    isVnLang
                                 )}
                              </span>
                           </div>
                        </div>
                     </div>
                  </Col>
                  <Col
                     style={{
                        flexBasis: '20%',
                        width: '20%',
                     }}
                  >
                     <div className='flex items-center flex-col p-6 h-full rounded-lg space-y-2 dark:bg-[#3B82F6]'>
                        <AiOutlineShoppingCart size={28} />
                        <span className='text-base font-normal'>
                           {t('overview.thisM')}
                        </span>

                        <span className='text-2xl font-semibold'>
                           {priceFormat(orderAmount.thisMonthAmount, isVnLang)}
                        </span>
                     </div>
                  </Col>
                  <Col
                     style={{
                        flexBasis: '20%',
                        width: '20%',
                     }}
                  >
                     <div className='flex items-center flex-col p-6 h-full rounded-lg space-y-2 dark:bg-[#0891B2]'>
                        <AiOutlineShoppingCart size={28} />
                        <span className='text-base font-normal'>
                           {t('overview.lastM')}
                        </span>

                        <span className='text-2xl font-semibold'>
                           {priceFormat(orderAmount.lastMonthAmount, isVnLang)}
                        </span>
                     </div>
                  </Col>
                  <Col
                     style={{
                        flexBasis: '20%',
                        width: '20%',
                     }}
                  >
                     <div className='flex items-center flex-col p-6 h-full rounded-lg space-y-2 dark:bg-[#059669]'>
                        <AiOutlineShoppingCart size={28} />
                        <span className='text-base font-normal'>
                           {t('overview.all')}
                        </span>

                        <span className='text-2xl font-semibold'>
                           {priceFormat(orderAmount.totalAmount, isVnLang)}
                        </span>
                     </div>
                  </Col>
               </Row>
               <Row gutter={8}>
                  <Col span={6}>
                     <div className='flex items-center space-x-4 p-5 rounded-lg h-22 dark:bg-[#1A1C23]'>
                        <div className='p-4 rounded-full bg-[#ED7D31]'>
                           <AiOutlineShoppingCart size={20} />
                        </div>
                        <div className='flex flex-col'>
                           <span className='text-gray-400 text-13'>
                              {t('overview.totalOrder')}
                           </span>
                           <span className='text-2xl font-bold'>
                              {orderCount.orders.reduce(
                                 (cur: number, item: any) => item.count + cur,
                                 0
                              )}
                           </span>
                        </div>
                     </div>
                  </Col>
                  <Col span={6}>
                     <div className='flex items-center space-x-4 p-5 rounded-lg h-22 dark:bg-[#1A1C23]'>
                        <div className='p-4 rounded-full bg-[#3B82F6]'>
                           <RxSymbol size={20} />
                        </div>
                        <div className='flex flex-col'>
                           <span className='text-gray-400 text-13'>
                              {t('overview.pending')}
                           </span>
                           <span className='text-2xl font-bold'>
                              {
                                 orderCount.orders.find(
                                    (item: any) => item.status === 'pending'
                                 ).count
                              }
                           </span>
                        </div>
                     </div>
                  </Col>
                  <Col span={6}>
                     <div className='flex items-center space-x-4 p-5 rounded-lg h-22 dark:bg-[#1A1C23]'>
                        <div className='p-4 rounded-full bg-[#14B8A6]'>
                           <LiaShippingFastSolid size={20} />
                        </div>
                        <div className='flex flex-col'>
                           <span className='text-gray-400 text-13'>
                              {t('overview.processing')}
                           </span>
                           <span className='text-2xl font-bold'>
                              {
                                 orderCount.orders.find(
                                    (item: any) => item.status === 'processing'
                                 ).count
                              }
                           </span>
                        </div>
                     </div>
                  </Col>
                  <Col span={6}>
                     <div className='flex items-center space-x-4 p-5 rounded-lg h-22 dark:bg-[#1A1C23]'>
                        <div className='p-4 rounded-full bg-[#10B981]'>
                           <BsCheckLg size={20} />
                        </div>
                        <div className='flex flex-col'>
                           <span className='text-gray-400 text-13'>
                              {t('overview.delivered')}
                           </span>
                           <span className='text-2xl font-bold'>
                              {
                                 orderCount.orders.find(
                                    (item: any) => item.status === 'delivered'
                                 ).count
                              }
                           </span>
                        </div>
                     </div>
                  </Col>
               </Row>
               <Row gutter={8}>
                  <Col span={12}>
                     <div className='relative h-full p-4 flex items-end dark:bg-[#1A1C23] rounded-lg'>
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
                                       label: t('aside.order'),
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
                     <div className='relative flex justify-center dark:bg-[#1A1C23] rounded-lg'>
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
                                          label: t('table.sold'),
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
