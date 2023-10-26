import { twMerge } from 'tailwind-merge';
import { Drawer } from 'antd';
import { useTranslation } from 'react-i18next';
import { useState, KeyboardEvent } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';

import { FiTrash2 } from 'react-icons/fi';
import { BsThreeDots } from 'react-icons/bs';
import { BiMessageSquareEdit } from 'react-icons/bi';

import CouponForm from './components/CouponForm';
import Title from '@/layouts/dashboard/components/Title';
import Table from '@/layouts/dashboard/components/Table';
import {
   Input,
   Button,
   Dropdown,
   Skeleton,
   PageTitle,
   Pagination,
   Tag,
} from '@/components';

import { dateFormat, notify, priceFormat } from '@/helpers';
import { ErrorResponse, ICoupon } from '@/types';
import { couponApi } from '@/api';
import moment from 'moment';

const DEFAULT_LIMIT = import.meta.env.VITE_APP_LIMIT || 15;

type Params = {
   name: string;
};

function Coupons() {
   const [couponActive, setCouponActive] = useState<ICoupon | null>(null);

   const [skip, setSkip] = useState<number>(0);
   const [params, setParams] = useState<Params>({} as Params);

   const [openDrawer, setOpenDrawer] = useState<boolean>(false);

   const { t } = useTranslation('dashboard');

   const { isLoading, data, refetch } = useQuery({
      queryKey: ['coupons', skip, params],
      queryFn: () =>
         couponApi.getAll({
            skip,
            limit: DEFAULT_LIMIT,
            ...params,
         }),
      keepPreviousData: true,
   });

   const deleteCouponMutation = useMutation({
      mutationFn: (id: string) => {
         return couponApi.delete(id);
      },
      onSuccess: (data) => {
         refetch();
         notify('success', `"${data.name}" deleted`);
      },
      onError: (error: ErrorResponse) => {
         notify('error', error.message);
      },
   });

   const closeDrawer = () => {
      setOpenDrawer(false);
      setCouponActive(null);
   };

   const searchCoupon = (e: KeyboardEvent<HTMLInputElement>) => {
      const value = e.currentTarget.value.trim();

      setSkip(0);
      if (value) setParams({ name: value });
      else setParams({} as Params);
   };

   const onEdit = (coupon: ICoupon) => {
      setOpenDrawer(true);
      setCouponActive(coupon);
   };

   return (
      <>
         <PageTitle title='Coupons' />
         <Title title={t('title.coupon')} />
         <div className='flex flex-col mt-6'>
            <div className='flex justify-between mb-4 space-x-4 h-11'>
               <Input
                  type='text'
                  placeholder={t('placeholderSearch.searchByName')}
                  className='flex-1 h-full px-4'
                  onKeyDown={(e) => e.key === 'Enter' && searchCoupon(e)}
               />
               <Button
                  className='h-full text-sm duration-150 bg-green-500 w-52 hover:bg-green-600'
                  onClick={() => setOpenDrawer(true)}
               >
                  + {t('form.addNew')}
               </Button>
            </div>
            {isLoading ? (
               <Skeleton />
            ) : (
               <Table
                  heading={
                     <tr className='[&>*:not(:last-child)]:px-4 [&>*]:py-3'>
                        <td className='w-[5%]'></td>
                        <td className='w-[20%]'>{t('table.name')}</td>
                        <td className='w-[15%]'>{t('code')}</td>
                        <td className='w-[15%]'>{t('value')}</td>
                        <td className='w-[15%]'>{t('expirationDate')}</td>
                        <td className='w-[10%]'>{t('status.status')}</td>
                        <td className='w-[5%]'></td>
                     </tr>
                  }
                  pagination={
                     data &&
                     data.coupons?.length > 0 && (
                        <Pagination
                           page={data.page}
                           lastPage={data.lastPage}
                           total={data.total}
                           currentTotal={data.coupons.length}
                           skip={skip}
                           setSkip={setSkip}
                           limit={DEFAULT_LIMIT}
                        />
                     )
                  }
               >
                  {data && data.coupons?.length > 0 ? (
                     data.coupons?.map((coupon, index) => (
                        <tr
                           key={index}
                           className={twMerge(
                              '[&>td:not(:first-child):not(:last-child)]:p-4',
                              deleteCouponMutation.variables === coupon._id &&
                                 deleteCouponMutation.isLoading &&
                                 'opacity-50'
                           )}
                        >
                           <td>
                              <p className='text-xs text-center text-gray-500'>
                                 {skip + index + 1}
                              </p>
                           </td>
                           <td>
                              <span className='capitalize line-clamp-1'>
                                 {coupon.name}
                              </span>
                           </td>
                           <td>
                              <span className='capitalize line-clamp-1'>
                                 {coupon.code}
                              </span>
                           </td>
                           <td>
                              <span>
                                 {coupon.type === 'percent'
                                    ? coupon.value + '%'
                                    : priceFormat(coupon.value)}
                              </span>
                           </td>
                           <td>
                              <span>{dateFormat(coupon.expirationDate)}</span>
                           </td>
                           <td>
                              {moment().isAfter(coupon.expirationDate) ? (
                                 <Tag title='Expired' className='bg-red-500' />
                              ) : (
                                 <Tag title='Active' className='bg-green-500' />
                              )}
                           </td>
                           <td>
                              {' '}
                              <Dropdown
                                 items={[
                                    {
                                       label: (
                                          <div
                                             className='flex items-center space-x-2'
                                             onClick={() => onEdit(coupon)}
                                          >
                                             <BiMessageSquareEdit />
                                             <span>{t('action.edit')}</span>
                                          </div>
                                       ),
                                    },
                                    {
                                       label: (
                                          <div
                                             className='flex items-center space-x-2'
                                             onClick={() =>
                                                deleteCouponMutation.mutate(
                                                   coupon._id
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
                        <td className='py-8 text-base text-center' colSpan={4}>
                           No results
                        </td>
                     </tr>
                  )}
               </Table>
            )}
         </div>

         <Drawer
            open={openDrawer}
            onClose={closeDrawer}
            width='40%'
            title={null}
            headerStyle={{
               display: 'none',
            }}
            bodyStyle={{
               padding: 0,
            }}
            className='dark:text-white'
         >
            <CouponForm data={couponActive} closeDrawer={closeDrawer} />
         </Drawer>
      </>
   );
}

export default Coupons;
