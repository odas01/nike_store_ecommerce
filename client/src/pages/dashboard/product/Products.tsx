import { twMerge } from 'tailwind-merge';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useState, KeyboardEvent } from 'react';
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
import Switch from 'react-switch';

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

   const updateStatusMutation = useMutation({
      mutationFn: ({ slug, status }: { slug: string; status: string }) => {
         return productApi.update(slug, { status });
      },
      onSuccess: () => {
         notify('success', 'Update product sucessfully');
         refetch();
      },
      onError: (error: ErrorResponse) => {
         notify('error', error.message);
      },
   });

   const deleteImgs = useMutation({
      mutationFn: (images: string[]) => productApi.deleteImageList(images),
   });

   const deleleProductMutation = useMutation({
      mutationFn: (id: string) => {
         return productApi.delete(id);
      },
      onSuccess: async () => {
         const _id = deleleProductMutation.variables;
         const variants = data?.products.find((item) => item._id === _id)
            ?.variants!;

         let deleteImages: string[] = [];
         variants.forEach(({ thumbnail, images }) => {
            deleteImages = [
               ...deleteImages,
               thumbnail.public_id,
               ...images.map((item) => item.public_id),
            ];
         });

         await deleteImgs.mutateAsync(deleteImages);
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

   const { t, i18n } = useTranslation(['dashboard', 'mutual']);
   const isVnLan = i18n.language === 'vi';
   return (
      <>
         <PageTitle title='Products' />
         <Title title={t('product.title')} />
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
                  + {t('action.addNew')}
               </Button>
            </div>

            {isLoading || cateQuery.isLoading ? (
               <Skeleton />
            ) : (
               <Table
                  heading={
                     <tr className='[&>*]:py-3'>
                        <td className='w-[5%]'></td>
                        <td className='w-[30%] pl-4'>
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
                              <span>{t('label.name', { ns: 'mutual' })}</span>
                              <BiSort />
                           </div>
                        </td>
                        <td className='w-[20%] pl-4'>
                           {t('label.category', { ns: 'mutual' })}
                        </td>
                        <td className='w-[10%] pl-4'>
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
                              <span>{t('label.price', { ns: 'mutual' })}</span>
                              <BiSort />
                           </div>
                        </td>
                        <td className='w-[10%]'>
                           <div
                              className='flex items-center justify-center w-full space-x-2 cursor-pointer'
                              onClick={() => {
                                 const arr = sort.split(':');
                                 if (arr[0] !== 'discount') {
                                    setSort('discount:-1');
                                 } else {
                                    setSort(
                                       arr[1] === '1'
                                          ? 'discount:-1'
                                          : 'discount:1'
                                    );
                                 }
                              }}
                           >
                              <span>Sale</span>
                              <BiSort />
                           </div>
                        </td>
                        <td className='w-[10%] text-center'>
                           <div
                              className='flex items-center justify-center w-full space-x-2 cursor-pointer'
                              onClick={() => {
                                 const arr = sort.split(':');
                                 if (arr[0] !== 'sold') {
                                    setSort('sold:-1');
                                 } else {
                                    setSort(
                                       arr[1] === '1' ? 'sold:-1' : 'sold:1'
                                    );
                                 }
                              }}
                           >
                              <span>{t('label.sold', { ns: 'mutual' })}</span>
                              <BiSort />
                           </div>
                        </td>
                        <td className='w-[10%] text-center'>
                           {' '}
                           <div
                              className='flex items-center justify-center w-full space-x-2 cursor-pointer'
                              onClick={() => {
                                 const arr = sort.split(':');
                                 if (arr[0] !== 'status') {
                                    setSort('status:-1');
                                 } else {
                                    setSort(
                                       arr[1] === '1' ? 'status:-1' : 'status:1'
                                    );
                                 }
                              }}
                           >
                              <span>
                                 {t('status.status', { ns: 'mutual' })}
                              </span>
                              <BiSort />
                           </div>
                        </td>
                        <td className='w-[5%]'></td>
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
                                 <span className='flex-1 py-1 line-clampx-2'>
                                    {product.name}
                                 </span>
                              </div>
                           </td>
                           <td className='px-4 py-4 capitalize'>
                              <p className='py-1 line-clampx-2'>
                                 {isVnLan
                                    ? product.category.vnName
                                    : product.category.name}
                              </p>
                              {/* <p className='flex items-center '>
                                 {product.genders}
                                 <span className='inline-block h-3 mx-2 border-r border-gray-500'></span>
                                 {product.category.store}
                              </p> */}
                           </td>
                           <td className='px-4 py-4'>
                              <span>
                                 {priceFormat(
                                    product.prices.originalPrice,
                                    isVnLan
                                 )}
                              </span>
                           </td>
                           <td>
                              <p className='text-center'>{product.discount}%</p>
                           </td>
                           <td>
                              <p className='text-center'>{product.sold || 0}</p>
                           </td>
                           <td>
                              <div className='flex items-center justify-center h-full'>
                                 <Switch
                                    offColor='#E53E3E'
                                    onColor='#2F855A'
                                    width={30}
                                    height={15}
                                    uncheckedIcon={false}
                                    checkedIcon={false}
                                    checked={product.status === 'show'}
                                    className='react-switch'
                                    onChange={(value) =>
                                       updateStatusMutation.mutate({
                                          slug: product.slug,
                                          status: value ? 'show' : 'hide',
                                       })
                                    }
                                 />
                              </div>
                           </td>
                           <td>
                              <Dropdown
                                 items={[
                                    {
                                       label: (
                                          <div
                                             className='flex items-center px-2 py-1 space-x-2'
                                             onClick={() =>
                                                navigate(`${product.slug}/edit`)
                                             }
                                          >
                                             <BiMessageSquareEdit />
                                             <span>
                                                {t('action.edit', {
                                                   ns: 'mutual',
                                                })}
                                             </span>
                                          </div>
                                       ),
                                    },
                                    {
                                       label: (
                                          <div
                                             className='flex items-center px-2 py-1 space-x-2'
                                             onClick={() =>
                                                navigate(
                                                   `${product.slug}/variants`
                                                )
                                             }
                                          >
                                             <BiMessageSquareEdit />
                                             <span>
                                                {t('label.variant', {
                                                   ns: 'mutual',
                                                })}
                                             </span>
                                          </div>
                                       ),
                                    },
                                    {
                                       label: (
                                          <div
                                             className='flex items-center px-2 py-1 space-x-2'
                                             onClick={() =>
                                                deleleProductMutation.mutate(
                                                   product._id
                                                )
                                             }
                                          >
                                             <FiTrash2 />
                                             <span>
                                                {t('action.delete', {
                                                   ns: 'mutual',
                                                })}
                                             </span>
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
