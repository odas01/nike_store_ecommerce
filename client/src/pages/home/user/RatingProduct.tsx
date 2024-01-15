import React, { FC, useState } from 'react';

import { Product } from '@/types';

import { useTranslation } from 'react-i18next';
import StarRatings from 'react-star-ratings';
import { Button, TextArea } from '@/components';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ratingApi } from '@/api';
import { useParams } from 'react-router-dom';
import authStore from '@/stores/authStore';
import { twMerge } from 'tailwind-merge';
import { AiFillEdit } from 'react-icons/ai';
interface Props {
   data: Product;
   setProductActive: React.Dispatch<React.SetStateAction<boolean | null>>;
}

const RatingProduct: FC<Props> = ({ data, setProductActive }) => {
   const { t, i18n } = useTranslation(['home', 'mutual', 'dashboard']);
   const isVnLang = i18n.language === 'vi';
   const { orderId } = useParams();

   const [rate, setRate] = useState<number>(5);
   const { currentUser } = authStore();
   const [cmtValue, setCmtValue] = useState<string>('');
   const createRatingMutation = useMutation({
      mutationFn: (comment: string) =>
         ratingApi.create({
            user: currentUser?._id!,
            product: data.product._id,
            order: orderId!,
            rate,
            comment,
         }),
      onSuccess: () => {
         setProductActive(null);
         queryClient.invalidateQueries({
            queryKey: ['orderdetail'],
         });
         //  if (skip !== 0) {
         //     setSkip(0);
         //  } else refetch();
         //  queryClient.invalidateQueries({ queryKey: ['avgRating'] });
      },
   });
   const queryClient = useQueryClient();

   return (
      <div className='flex flex-col'>
         <div className='flex items-center px-4 py-3 space-x-5'>
            <img src={data.thumbnail} className='w-20 aspect-square' alt='' />
            <div className='flex flex-col'>
               <span className='text-lg'>{data.name}</span>
               <span className='italic font-normal capitalize'>
                  {data.variant.color.name} - {data.size}
               </span>
            </div>
         </div>
         <div className='flex items-center justify-center mt-8 mb-4 space-x-2'>
            <span className='text-sm font-medium'>
               {t('rating.pleaseChooes')}:{' '}
            </span>
            <StarRatings
               rating={rate}
               starRatedColor='#F8DE22'
               starHoverColor='#F8DE22'
               starDimension='20px'
               starSpacing='2px'
               changeRating={(newRate) => setRate(newRate)}
               numberOfStars={5}
               name='rating'
            />
         </div>
         <div className='flex items-center space-x-6'>
            <TextArea
               className='flex-1'
               rows={3}
               value={cmtValue}
               onChange={(e) => setCmtValue(e.currentTarget.value)}
               onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                     createRatingMutation.mutate(cmtValue);
                     setCmtValue('');
                  }
               }}
            />
            <Button
               className={twMerge(
                  'flex items-center px-3 space-x-1 text-xs rounded h-8',
                  createRatingMutation.isLoading && 'pointer-events-none'
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
   );
};

export default RatingProduct;
