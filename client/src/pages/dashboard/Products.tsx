import { twMerge } from 'tailwind-merge';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useState, KeyboardEvent, useEffect } from 'react';
import { useMutation, useQueries } from '@tanstack/react-query';

import { FiTrash2 } from 'react-icons/fi';
import { BsThreeDots } from 'react-icons/bs';
import { BiMessageSquareEdit, BiSort } from 'react-icons/bi';

import Title from '@/layouts/dashboard/components/Title';
import Table from '@/layouts/dashboard/components/Table';
import {
   Tag,
   Modal,
   Input,
   Button,
   Skeleton,
   Dropdown,
   PageTitle,
   Pagination,
} from '@/components';

import { categoryApi, productApi } from '@/api';
import { ErrorResponse } from '@/types';
import { notify, priceFormat } from '@/helpers';

const DEFAULT_LIMIT = import.meta.env.VITE_APP_LIMIT || 1;

type Params = {
   name: string;
};

function Products() {
   const [skip, setSkip] = useState<number>(0);
   const [params, setParams] = useState<Params>({} as Params);
   const [sort, setSort] = useState<string>('');

   const [openModal, setOpenModal] = useState<boolean>(false);

   const navigate = useNavigate();

   const [{ data, isLoading, refetch }, cateQuery] = useQueries({
      queries: [
         {
            queryKey: ['products', skip, params, sort],
            queryFn: () =>
               productApi.getAll({
                  skip: skip,
                  limit: DEFAULT_LIMIT,
                  sort: sort,
                  ...params,
               }),
         },
         {
            queryKey: ['categories'],
            queryFn: () => categoryApi.getAll({}),
         },
      ],
   });

   const deleleProductMutation = useMutation({
      mutationFn: (id: string) => {
         return productApi.delete(id);
      },
      onSuccess: () => {
         notify('success', 'Deleted product sucessfully');
         refetch();
      },
      onError: (error: ErrorResponse) => {
         notify('error', error.message);
      },
   });

   const searchProduct = (e: KeyboardEvent<HTMLInputElement>) => {
      const value = e.currentTarget.value.trim();

      setSkip(0);
      if (value) setParams({ name: value });
      else setParams({} as Params);
   };

   const { t } = useTranslation('dashboard');
   return (
      <>
         <PageTitle title='Products' />
         <Title title={t('title.product')} />
         <div className='flex flex-col mt-6'>
            <div className='flex justify-between mb-4 space-x-4 h-11'>
               <Input
                  type='text'
                  placeholder={t('placeholderSearch.searchByName')}
                  className='flex-1 h-full px-4'
                  onKeyDown={(e) => e.key === 'Enter' && searchProduct(e)}
               />
               <Button
                  className='h-full text-sm duration-150 bg-green-500 w-52 hover:bg-green-600'
                  onClick={() => navigate('create')}
               >
                  + {t('form.addNew')}
               </Button>
            </div>

            {isLoading || cateQuery.isLoading ? (
               <Skeleton />
            ) : (
               <Table
                  heading={
                     <tr className='[&>*:not(:last-child)]:px-4 [&>*]:py-3'>
                        <td className='w-[5%]'></td>
                        <td className='w-[25%]'>
                           <div
                              className='flex items-center space-x-2 cursor-pointer w-fit'
                              onClick={() => {
                                 const arr = sort.split(':');
                                 if (arr[0] !== 'name') {
                                    setSort('name:-1');
                                 } else {
                                    setSort(
                                       arr[1] === '1' ? 'name:-1' : 'name:1'
                                    );
                                 }
                              }}
                           >
                              <span>{t('table.name')}</span>
                              <BiSort />
                           </div>
                        </td>
                        <td className='w-[20%]'>{t('table.category')}</td>
                        <td className='w-[18%]'>
                           <div
                              className='flex items-center space-x-2 cursor-pointer w-fit'
                              onClick={() => {
                                 const arr = sort.split(':');
                                 if (arr[0] !== 'prices.originalPrice') {
                                    setSort('prices.originalPrice:-1');
                                 } else {
                                    setSort(
                                       arr[1] === '1'
                                          ? 'prices.originalPrice:-1'
                                          : 'prices.originalPrice:1'
                                    );
                                 }
                              }}
                           >
                              <span>{t('table.price')}</span>
                              <BiSort />
                           </div>
                        </td>
                        <td className='w-[12%] text-center'>
                           {t('table.productColors')}
                        </td>
                        <td className='w-[10%] text-center'>
                           {t('status.status')}
                        </td>
                        <td className='w-[10%]'></td>
                     </tr>
                  }
                  pagination={
                     data &&
                     data.products.length > 0 && (
                        <Pagination
                           page={data.page}
                           lastPage={data.lastPage}
                           total={data.total}
                           currentTotal={data.products.length}
                           skip={skip}
                           setSkip={setSkip}
                        />
                     )
                  }
               >
                  {data && data.products.length > 0 ? (
                     data.products?.map((product, index) => (
                        <tr
                           key={index}
                           className={twMerge(
                              '[&>td:not(:first-child):not(:last-child)]:p-4',
                              deleleProductMutation.variables === product._id &&
                                 deleleProductMutation.isLoading &&
                                 'opacity-50'
                           )}
                        >
                           <td>
                              <p className='text-xs text-center text-gray-500'>
                                 {skip + index + 1}
                              </p>
                           </td>

                           <td className='px-4 py-4'>
                              <div className='flex items-center justify-center space-x-4'>
                                 <div className='w-8 aspect-square'>
                                    <img
                                       src={product.variants[0].thumbnail.url}
                                       className='object-cover rounded-full'
                                       alt='product-img'
                                    />
                                 </div>
                                 <span className='flex-1 line-clamp-2'>
                                    {product.name}
                                 </span>
                              </div>
                           </td>
                           <td className='px-4 py-4 capitalize'>
                              <p className='line-clamp-1'>
                                 {product.category.name}
                              </p>
                              <p className='flex items-center '>
                                 {product.genders}
                                 <span className='inline-block h-3 mx-2 border-r border-gray-500'></span>
                                 {product.category.store}
                              </p>
                           </td>
                           <td className='px-4 py-4'>
                              <p>
                                 {/* {t('table.price')}:{' '} */}
                                 {priceFormat(product.prices.originalPrice)}
                              </p>
                              <p>Discount: {product.discount + '%'}</p>
                           </td>
                           <td>
                              <div className='grid grid-cols-3 gap-y-2 justify-items-center'>
                                 {product.variants.map((variant, index) => {
                                    return (
                                       <div
                                          key={index}
                                          className='inline-block w-5 rounded-md aspect-square'
                                          style={{
                                             backgroundColor:
                                                variant.color.value,
                                          }}
                                       />
                                    );
                                 })}
                              </div>
                           </td>
                           <td className='flex justify-center'>
                              {product.status === 'show' ? (
                                 <Tag title={t('status.show')} />
                              ) : (
                                 <Tag
                                    title={t('status.hide')}
                                    className='bg-red-400'
                                 />
                              )}
                           </td>
                           <td>
                              <Dropdown
                                 items={[
                                    {
                                       label: (
                                          <div
                                             className='flex items-center p-1 space-x-2'
                                             onClick={() =>
                                                navigate(`${product.slug}/edit`)
                                             }
                                          >
                                             <BiMessageSquareEdit />
                                             <span>{t('action.edit')}</span>
                                          </div>
                                       ),
                                    },
                                    {
                                       label: (
                                          <div
                                             className='flex items-center p-1 space-x-2'
                                             onClick={() =>
                                                navigate(
                                                   `${product.slug}/variants`
                                                )
                                             }
                                          >
                                             <BiMessageSquareEdit />
                                             <span>Quản lí biến thể</span>
                                          </div>
                                       ),
                                    },
                                    {
                                       label: (
                                          <div
                                             className='flex items-center p-1 space-x-2'
                                             onClick={() =>
                                                deleleProductMutation.mutate(
                                                   product._id
                                                )
                                             }
                                          >
                                             <FiTrash2 />
                                             <span>{t('action.delete')}</span>
                                          </div>
                                       ),
                                    },
                                 ]}
                              >
                                 <div className='flex justify-center'>
                                    <BsThreeDots />
                                 </div>
                              </Dropdown>
                           </td>
                        </tr>
                     ))
                  ) : (
                     <tr>
                        <td className='py-8 text-base text-center' colSpan={7}>
                           No results
                        </td>
                     </tr>
                  )}
               </Table>
            )}
            {/* {isLoading ? (
               <Loading />
            ) : (
               <div className='border border-table_db dark:border-[#343434] rounded-md text-sm overflow-hidden'>
                  <table className='w-full'>
                     <thead className='font-medium border-b border-inherit text-table_db_thead'>
                        <tr className='[&>*:not(:last-child)]:px-4 [&>*]:py-3'>
                           <td className='w-[5%]'></td>
                           <td className='w-[%]'>Name</td>
                           <td className='w-[%]'>Category</td>
                           <td className='w-[%]'>Price</td>
                           <td className='w-[%]'>Date</td>
                           <td className='w-[10%] text-center'>Status</td>
                           <td className='w-[10%]'></td>
                        </tr>
                     </thead>
                     <tbody className='divide-y divide-table_db dark:divide-[#343434] font-normal'>
                        
                     </tbody>
                  </table>
                  {data && data.products.length > 0 && (
                     <Pagination
                        page={data.page}
                        lastPage={data.lastPage}
                        total={data.total}
                        currentTotal={data.products.length}
                        skip={skip}
                        setSkip={setSkip}
                     />
                  )}
               </div>
            )} */}
         </div>
         <Modal
            title='Change password'
            open={openModal}
            onOk={() => setOpenModal(true)}
            onCancel={() => setOpenModal(false)}
         >
            <Input className='w-full' />
         </Modal>
      </>
   );
}

export default Products;
