import { productApi } from '@/api';
import images from '@/assets/images';
import ProductCard from '@/layouts/home/components/ProductCard';
import {
   useInfiniteQuery,
   useQuery,
   useQueryClient,
} from '@tanstack/react-query';
import { Breadcrumb, Col, Row } from 'antd';
import { KeyboardEvent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroll-component';
import { IProduct } from '@/types';
import { Input, Skeleton } from '@/components';
import Filter from '@/layouts/home/components/Filter';
import Sort from '@/layouts/home/components/Sort';
import { twMerge } from 'tailwind-merge';
import { FiSearch } from 'react-icons/fi';
import TitleShop from '@/layouts/home/components/TitleShop';

export interface Filter {
   category: string;
   size: string[];
   color: string[];
}

const Shop = () => {
   const [sort, setSort] = useState<string>('');
   const [filter, setFilter] = useState<Partial<Filter>>({});

   const params = useParams();
   const { t } = useTranslation('home');

   const [searchParams] = useSearchParams();
   const convertParamsTitle = Object.fromEntries([...searchParams]).q;

   const { data, hasNextPage, fetchNextPage, isLoading, isFetching } =
      useInfiniteQuery({
         queryKey: ['products', params, sort, filter, convertParamsTitle],
         queryFn: ({ pageParam = 0 }) => {
            return productApi.getAll({
               skip: pageParam * 6,
               limit: 6,
               sort,
               status: 'show',
               name: convertParamsTitle,
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

   const products = data?.pages.reduce(
      (cur, item) => [...cur, ...item.products],
      [] as IProduct[]
   );

   return (
      <div className='container space-y-4'>
         <img src={images.banner.top} alt='' className='rounded' />
         {isLoading ? (
            <Skeleton />
         ) : (
            <div className='space-y-6'>
               <Row gutter={24}>
                  <Col span={5} className='relative pt-4'>
                     <div className='sticky pr-4 top-4'>
                        <Filter setFilter={setFilter} />
                     </div>
                  </Col>
                  <Col span={19} className='relative'>
                     <div className=''>
                        <div className='sticky flex items-center justify-between -top-[1px] py-3 z-[100] bg-white '>
                           {convertParamsTitle ? (
                              <h2 className='space-x-2 text-xl font-medium'>
                                 <span className='text-xs font-medium '>
                                    Search result for:
                                 </span>
                                 <span>
                                    {convertParamsTitle} ({data?.pages[0].total}
                                    )
                                 </span>
                              </h2>
                           ) : (
                              <TitleShop qty={data?.pages[0].total!} />
                           )}

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
                              <Row gutter={[12, 32]}>
                                 {products?.map((item, index) => (
                                    <Col span={8} key={index}>
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
      </div>
   );
};

export default Shop;
