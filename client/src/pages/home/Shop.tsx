import { Col, Row, Spin } from 'antd';
import { twMerge } from 'tailwind-merge';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';

import Sort from '@/layouts/home/components/shop/Sort';
import Filter from '@/layouts/home/components/shop/Filter';
import ProductCard from '@/components/ProductCard';

import { IProduct } from '@/types';
import { store } from '@/constants';
import { categoryApi, productApi } from '@/api';
import { BreadCrumb, PageTitle } from '@/components';

export interface Filter {
   category: string;
   size: string[];
   color: string[];
}

type Store = (typeof store)[number];

const Shop = () => {
   const [sort, setSort] = useState<string>('');
   const [filter, setFilter] = useState<Partial<Filter>>({});

   const params = useParams();
   const { t, i18n } = useTranslation(['home', 'mutual', 'dashboard']);

   const [title, setTitle] = useState<string>('');

   const isVn = i18n.language === 'vi';
   const categoriesQuery = useQuery({
      queryKey: ['categories'],
      queryFn: () =>
         categoryApi.getAll({
            skip: 0,
            limit: 100,
         }),
   });

   const { data, hasNextPage, fetchNextPage, isLoading, isFetching } =
      useInfiniteQuery({
         queryKey: ['products', params, sort, filter],
         queryFn: ({ pageParam = 0 }) => {
            return productApi.getAll({
               skip: pageParam * 6,
               limit: 6,
               sort,
               status: 'show',
               ...filter,
               ...params,
            });
         },
         getNextPageParam: ({ page, lastPage }) => {
            if (page < lastPage) {
               return page;
            }
         },
         staleTime: 0,
         keepPreviousData: true,
      });

   useEffect(() => {
      const foundCate = categoriesQuery.data?.categories.find((item) => {
         if (params.category) {
            return item.name === params.category;
         }
         return item.store === params.store;
      });

      if (foundCate) {
         if (params.category) {
            setTitle(isVn ? foundCate?.vnName : foundCate?.name);
         } else {
            setTitle(t(`store.${foundCate.store as Store}`, { ns: 'mutual' }));
         }
      }
      if (!params.store) {
         setTitle(t('allProducts'));
      }
   }, [params, data, isVn]);

   const products = data?.pages.reduce(
      (cur, item) => [...cur, ...item.products],
      [] as IProduct[]
   );

   return (
      <>
         <PageTitle title='Category' />
         <BreadCrumb
            className='mobile:hidden'
            items={[
               {
                  title: t('home.home'),
               },
               {
                  title: t('label.category', { ns: 'mutual' }),
               },
            ]}
         />
         {isLoading ? (
            <div className='absolute flex justify-center translate-x-1/2 right-1/2 top-1/3'>
               <Spin size='large' />
            </div>
         ) : (
            <div className='space-y-6 mobile:pt-4 mobile:px-2'>
               <Row gutter={24}>
                  <Col xl={5} md={5} xs={0} className='relative pt-4'>
                     <div className='sticky pr-4 top-4'>
                        <Filter setFilter={setFilter} />
                     </div>
                  </Col>
                  <Col xl={19} md={19} xs={24} className='relative'>
                     <div className='space-y-4'>
                        <div className='sticky flex items-center justify-between -top-[1px] xl:py-3 md:py-1.5 z-[100] bg-white '>
                           {/* <TitleShop qty={data?.pages[0].total!} /> */}
                           <h2 className='text-sm font-medium capitalize xl:text-xl md:text-lg'>
                              {title} ({data?.pages[0].total})
                           </h2>

                           <div
                              className={twMerge(
                                 !products?.length &&
                                    'cursor-not-allowed pointer-events-none'
                              )}
                           >
                              <Sort {...{ sort, setSort }} />
                           </div>
                        </div>
                        {products?.length ? (
                           <InfiniteScroll
                              className='!overflow-visible relative'
                              dataLength={products?.length || 0} //This is important field to render the next data
                              next={() => fetchNextPage()}
                              hasMore={hasNextPage || false}
                              loader={<></>}
                           >
                              <Row
                                 gutter={[
                                    { xs: 4, md: 8, xl: 12 },
                                    { xs: 12, md: 28, xl: 32 },
                                 ]}
                              >
                                 {products?.map((item, index) => (
                                    <Col xl={8} md={12} xs={12} key={index}>
                                       <ProductCard data={item} />
                                    </Col>
                                 ))}
                                 {isFetching && (
                                    <div className='absolute w-full h-full bg-[rgba(255,255,255,0.54)] z-[101]' />
                                 )}
                              </Row>
                           </InfiniteScroll>
                        ) : (
                           <h2 className='text-2xl text-center uppercase'>
                              {t('noProductsMatch')}
                           </h2>
                        )}
                     </div>
                  </Col>
               </Row>
            </div>
         )}
      </>
   );
};

export default Shop;
