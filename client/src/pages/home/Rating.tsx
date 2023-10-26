import { ratingApi } from '@/api';
import { Button, Dropdown, TextArea } from '@/components';
import { notify } from '@/helpers';
import authStore from '@/stores/authStore';
import { ErrorResponse } from '@/types';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Pagination, Spin } from 'antd';
import moment from 'moment';
import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AiFillEdit } from 'react-icons/ai';
import { BsStarFill, BsThreeDots } from 'react-icons/bs';
import { twMerge } from 'tailwind-merge';

interface RatingProps {
   productId: string;
}

const Rating: FC<RatingProps> = ({ productId }) => {
   const [rate, setRate] = useState<number>(5);
   const [cmtValue, setCmtValue] = useState<string>('');
   const [skip, setSkip] = useState(0);
   const { t } = useTranslation('home');

   const { currentUser } = authStore();

   const { data, isLoading, refetch, isFetching } = useQuery({
      queryKey: ['ratings', productId, skip],
      queryFn: () =>
         ratingApi.getAll({
            skip: skip * 5,
            limit: 5,
            product: productId,
         }),
      staleTime: 0,
   });

   const createRatingMutation = useMutation({
      mutationFn: (comment: string) =>
         ratingApi.create({
            user: currentUser?._id!,
            product: productId,
            rate,
            comment,
         }),
      onSuccess: () => {
         if (skip !== 0) {
            setSkip(0);
         } else refetch();
      },
      onError: (err: ErrorResponse) => {
         notify('error', err.message);
      },
   });
   const deleteRatingMutation = useMutation({
      mutationFn: (id: string) => ratingApi.delete(id),
      onSuccess: () => {
         refetch();
      },
      onError: (err: ErrorResponse) => {
         notify('error', err.message);
      },
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
      <div className=' px-20 w-[62%] py-4 bg-[#f6f6f6]'>
         {isLoading ? (
            <div className='flex justify-center'>
               <Spin size='large' />
            </div>
         ) : (
            <>
               <div className='flex items-center space-x-4'>
                  <div className='flex flex-col items-center w-1/2'>
                     <h2 className='text-xl font-semibold'>
                        {t('rating.productRatings')}
                     </h2>
                     <span className='mt-2 text-3xl font-semibold text-red-500'>
                        {data && data.total > 0
                           ? avgRatings + '/5'
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
                  <div className='flex space-x-1 text-sm'>
                     <div className='flex flex-col'>
                        <span>5</span>
                        <span>4</span>
                        <span>3</span>
                        <span>2</span>
                        <span>1</span>
                     </div>
                     <div className='flex flex-col'>
                        {Array(5)
                           .fill(5)
                           .map((_, index) => (
                              <div
                                 className='flex items-center h-5'
                                 key={index}
                              >
                                 {Array(5 - index)
                                    .fill(0)
                                    .map((_, index2) => (
                                       <BsStarFill
                                          key={index2}
                                          color='#F8DE22'
                                          size={14}
                                       />
                                    ))}
                                 <span className='ml-2 text-xs'>
                                    ({countRate(5 - index)}{' '}
                                    {countRate(5 - index) > 1
                                       ? t('rating.ratings')
                                       : t('rating.rating')}
                                    )
                                 </span>
                              </div>
                           ))}
                     </div>
                  </div>
               </div>
               <div className='relative flex flex-col mt-8'>
                  <div className='flex flex-col'>
                     <span className='text-sm'>{t('comments')}</span>
                     <TextArea
                        value={cmtValue}
                        onChange={(e) => setCmtValue(e.currentTarget.value)}
                        onKeyDown={(e) => {
                           if (e.key === 'Enter') {
                              createRatingMutation.mutate(cmtValue);
                              setCmtValue('');
                           }
                        }}
                     />
                     <div className='flex items-center justify-between mt-1'>
                        <div className='flex space-x-2'>
                           <div
                              className={twMerge(
                                 'flex px-2 py-1 border cursor-pointer text-[#ccc]',
                                 rate === 1 && 'border-[#F8DE22] text-[#F8DE22]'
                              )}
                              onClick={() => setRate(1)}
                           >
                              <BsStarFill color='inherit' size={12} />
                           </div>

                           <div
                              className={twMerge(
                                 'flex px-2 py-1 border cursor-pointer text-[#ccc]',
                                 rate === 2 && 'border-[#F8DE22] text-[#F8DE22]'
                              )}
                              onClick={() => setRate(2)}
                           >
                              <BsStarFill color='inherit' size={12} />
                              <BsStarFill color='inherit' size={12} />
                           </div>

                           <div
                              className={twMerge(
                                 'flex px-2 py-1 border cursor-pointer text-[#ccc]',
                                 rate === 3 && 'border-[#F8DE22] text-[#F8DE22]'
                              )}
                              onClick={() => setRate(3)}
                           >
                              <BsStarFill color='inherit' size={12} />
                              <BsStarFill color='inherit' size={12} />
                              <BsStarFill color='inherit' size={12} />
                           </div>

                           <div
                              className={twMerge(
                                 'flex px-2 py-1 border cursor-pointer text-[#ccc]',
                                 rate === 4 && 'border-[#F8DE22] text-[#F8DE22]'
                              )}
                              onClick={() => setRate(4)}
                           >
                              <BsStarFill color='inherit' size={12} />
                              <BsStarFill color='inherit' size={12} />
                              <BsStarFill color='inherit' size={12} />
                              <BsStarFill color='inherit' size={12} />
                           </div>

                           <div
                              className={twMerge(
                                 'flex px-2 py-1 border cursor-pointer text-[#ccc]',
                                 rate === 5 && 'border-[#F8DE22] text-[#F8DE22]'
                              )}
                              onClick={() => setRate(5)}
                           >
                              <BsStarFill color='inherit' size={12} />
                              <BsStarFill color='inherit' size={12} />
                              <BsStarFill color='inherit' size={12} />
                              <BsStarFill color='inherit' size={12} />
                              <BsStarFill color='inherit' size={12} />
                           </div>
                        </div>
                        <Button
                           className={twMerge(
                              'flex items-center px-2 space-x-1 text-xs rounded-sm h-7',
                              createRatingMutation.isLoading &&
                                 'pointer-events-none'
                           )}
                           onClick={() => {
                              createRatingMutation.mutate(cmtValue);
                              setCmtValue('');
                           }}
                        >
                           <AiFillEdit />
                           {t('share')}
                        </Button>
                     </div>
                  </div>

                  <div className='flex flex-col mt-6 space-y-4 divide-y divide-gray-300'>
                     {data?.ratings.map((item, index) => {
                        const rateOfUser =
                           item?.user?.email === currentUser?.email ||
                           currentUser?.role === 'root';

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
                              {rateOfUser && (
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
                              )}
                           </div>
                        );
                     })}
                  </div>
               </div>
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
