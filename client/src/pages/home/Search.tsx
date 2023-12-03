import { Col, Row, Spin } from 'antd';
import { useTranslation } from 'react-i18next';
import { Link, useSearchParams } from 'react-router-dom';
import { useInfiniteQuery } from '@tanstack/react-query';
import InfiniteScroll from 'react-infinite-scroll-component';

import { PageTitle } from '@/components';
import ProductCard from '@/layouts/home/components/ProductCard';

import { productApi } from '@/api';
import { IProduct } from '@/types';

const Search = () => {
   const [searchParams] = useSearchParams();
   const convertParamsTitle = Object.fromEntries([...searchParams]).q;
   const { t } = useTranslation(['home', 'mutual']);

   const { data, hasNextPage, fetchNextPage, isLoading, isFetching } =
      useInfiniteQuery({
         queryKey: ['products', convertParamsTitle],
         queryFn: ({ pageParam = 0 }) => {
            return productApi.getAll({
               skip: pageParam * 6,
               limit: 6,
               status: 'show',
               name: convertParamsTitle,
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
   const products = data?.pages.reduce(
      (cur, item) => [...cur, ...item.products],
      [] as IProduct[]
   );

   return (
      <>
         <PageTitle title={`Search for: "${convertParamsTitle}"`} />
         <div className='space-y-6'>
            <div className='bg-[#f5f5f5] py-2 text-13'>
               <div className='container space-x-2'>
                  <Link to='/'>{t('home.home')}</Link>
                  <span className='text-[#ccc]'>/</span>
                  <span className='capitalize text-[#777]'>
                     {t('search.search')}
                  </span>
               </div>
            </div>
            {isLoading ? (
               <div className='flex justify-center'>
                  <Spin size='large' />
               </div>
            ) : (
               <div className='container space-y-6'>
                  <div className='flex flex-col items-center space-y-4'>
                     <h2 className='text-3xl font-medium'>
                        {t('search.search')}
                     </h2>
                     <span className='opacity-75'>
                        {t('search.count', { count: data?.pages[0].total })}
                     </span>
                     <div className='w-16 h-1 mx-auto mt-6 bg-black' />
                  </div>
                  <div className='space-x-0.5'>
                     <span className='text-sm'>{t('search.result')}</span>
                     <span className='font-medium text-15'>
                        {' '}
                        "{convertParamsTitle}"
                     </span>
                  </div>

                  {products?.length ? (
                     <InfiniteScroll
                        className='!overflow-visible relative'
                        dataLength={products?.length || 0} //This is important field to render the next data
                        next={() => fetchNextPage()}
                        hasMore={hasNextPage || false}
                        loader={<></>}
                     >
                        <Row gutter={[12, 32]}>
                           {products?.map((item, index) => (
                              <Col span={6} key={index}>
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
            )}
         </div>
      </>
   );
};

export default Search;
