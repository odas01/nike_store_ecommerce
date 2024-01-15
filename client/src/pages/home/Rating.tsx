import moment from 'moment';
import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Col, Pagination, Progress, Row, Spin } from 'antd';
import { useQuery } from '@tanstack/react-query';

import { BsStarFill } from 'react-icons/bs';

import { ratingApi } from '@/api';

interface RatingProps {
   productId: string;
}

const Rating: FC<RatingProps> = ({ productId }) => {
   const [skip, setSkip] = useState(0);
   const { t } = useTranslation('home');

   const { data, isLoading } = useQuery({
      queryKey: ['ratings', productId, skip],
      queryFn: () =>
         ratingApi.getAll({
            skip: skip * 5,
            limit: 5,
            product: productId,
         }),
      staleTime: 0,
   });

   const avgRatings = data
      ? (
           (data.rateCount.reduce(
              (cur, { count, rate }) => cur + count * rate,
              0
           ) /
              (data.total * 5)) *
           5
        ).toFixed(1)
      : 5;

   const countRate = (rate: number) =>
      data?.rateCount.find((item) => item.rate === rate)?.count || 0;

   return (
      <div className=' pl-20 pr-[38%] py-12 border'>
         {isLoading ? (
            <div className='flex justify-center'>
               <Spin size='large' />
            </div>
         ) : (
            <>
               {data && (
                  <>
                     <Row gutter={12}>
                        <Col span={9}>
                           <div className='flex flex-col items-center h-full py-2'>
                              <h2 className='text-xl font-semibold'>
                                 {t('rating.productRatings')}
                              </h2>
                              <span className='mt-2 text-3xl font-semibold text-red-500'>
                                 {data.total > 0
                                    ? avgRatings + '/5.0'
                                    : t('rating.noRatings')}
                              </span>
                              <span className='text-sm'>
                                 ({data?.total}{' '}
                                 {data?.total! > 1
                                    ? t('rating.ratings')
                                    : t('rating.rating')}
                                 )
                              </span>
                           </div>
                        </Col>
                        <Col span={15}>
                           <div className='flex flex-col flex-1 text-sm'>
                              {Array(5)
                                 .fill(5)
                                 .map((_, index) => (
                                    <div className='w-full' key={index}>
                                       <Row gutter={4}>
                                          <Col span={4}>
                                             <div className='flex items-center justify-center space-x-1'>
                                                <span>{5 - index}</span>

                                                <BsStarFill
                                                   color='#F8DE22'
                                                   size={14}
                                                />
                                             </div>
                                          </Col>
                                          <Col span={14}>
                                             <Progress
                                                percent={
                                                   (countRate(5 - index) /
                                                      data.total) *
                                                   100
                                                }
                                                strokeColor='#F8DE22'
                                                className='!m-0 flex [&>div]:!pr-0'
                                                format={() => ''}
                                             />
                                          </Col>
                                          <Col
                                             span={6}
                                             className='flex items-center'
                                          >
                                             <p className='ml-2 text-xs text-end'>
                                                ({countRate(5 - index)}{' '}
                                                {countRate(5 - index) > 1
                                                   ? t('rating.ratings')
                                                   : t('rating.rating')}
                                                )
                                             </p>
                                          </Col>
                                       </Row>
                                    </div>
                                 ))}
                           </div>
                        </Col>
                     </Row>
                     <div className='relative flex flex-col mt-8'>
                        <div className='flex flex-col mt-6 space-y-4 divide-y divide-gray-300'>
                           {data?.ratings.map((item, index) => {
                              return (
                                 <div
                                    key={index}
                                    className='relative pt-4 animate-effectt'
                                 >
                                    <div className='flex items-center space-x-1'>
                                       <div className='w-10 overflow-hidden border rounded-full aspect-square h-fit'>
                                          <img
                                             src={item.user?.avatar?.url || ''}
                                             alt=''
                                          />
                                       </div>
                                       <div>
                                          <span className='text-xs font-semibold'>
                                             {item.user?.name}
                                          </span>
                                          <div className='flex'>
                                             {Array(item.rate)
                                                .fill(0)
                                                .map((_, index2) => (
                                                   <BsStarFill
                                                      key={index2}
                                                      color='#F8DE22'
                                                      size={14}
                                                   />
                                                ))}
                                          </div>
                                          <span className='text-xs font-medium text-gray-500'>
                                             {moment(item.createdAt).format(
                                                'DD/MM YYYY HH:mm'
                                             )}
                                          </span>
                                       </div>
                                    </div>

                                    <p className='pl-10 mt-2'>
                                       {item.comment || ' no message'}
                                    </p>
                                    {/* {rateOfUser && (
                                       <div className='absolute right-0 top-4'>
                                          <Dropdown
                                             arrow={true}
                                             border={false}
                                             trigger={['click']}
                                             placement='bottomRight'
                                             items={[
                                                {
                                                   label: (
                                                      <span
                                                         className='p-2'
                                                         onClick={() =>
                                                            deleteRatingMutation.mutate(
                                                               item._id
                                                            )
                                                         }
                                                      >
                                                         Xoá
                                                      </span>
                                                   ),
                                                },
                                             ]}
                                          >
                                             <BsThreeDots />
                                          </Dropdown>
                                       </div>
                                    )} */}
                                 </div>
                              );
                           })}
                        </div>
                     </div>
                  </>
               )}
               {data && data.total > 0 && (
                  <div className='flex justify-center pt-4 mt-8 border-t'>
                     <Pagination
                        current={skip + 1}
                        pageSize={5}
                        total={data?.total}
                        onChange={(a) => {
                           setSkip(a - 1);
                        }}
                        className='text-base'
                     />
                  </div>
               )}
            </>
         )}
      </div>
   );
};

export default Rating;
