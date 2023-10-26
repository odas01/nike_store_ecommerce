import { categoryApi } from '@/api';
import { useQuery } from '@tanstack/react-query';
import { Spin } from 'antd';
import React, { FC, memo, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface TitleShopProps {
   qty: number;
}

const TitleShop: FC<TitleShopProps> = ({ qty }) => {
   const params = useParams();
   const { i18n, t } = useTranslation(['home', 'mutual']);
   const [title, setTitle] = useState<string>('');

   const isVn = i18n.language === 'vi';
   const { data, isLoading } = useQuery({
      queryKey: ['categories'],
      queryFn: () =>
         categoryApi.getAll({
            skip: 0,
            limit: 100,
         }),
   });

   useEffect(() => {
      const foundCate = data?.categories.find((item) => {
         if (params.category) {
            return item.name === params.category;
         }
         return item.store === params.store;
      });

      let newTitle = '';
      if (foundCate) {
         if (params.category) {
            setTitle(isVn ? foundCate?.vnName : foundCate?.name);
         } else {
            setTitle(t(`store.${foundCate.store}`, { ns: 'mutual' }));
         }
      }
      if (!params.store) {
         setTitle(t('allProducts'));
      }
   }, [params, data, isVn]);

   return (
      <>
         {isLoading && <Spin />}
         {data && (
            <h2 className='text-xl font-medium capitalize'>
               {title} ({qty})
            </h2>
         )}
      </>
   );
};

export default memo(TitleShop);
