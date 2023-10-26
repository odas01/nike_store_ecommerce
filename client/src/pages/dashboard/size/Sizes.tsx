import { twMerge } from 'tailwind-merge';
import { Drawer } from 'antd';
import { useTranslation } from 'react-i18next';
import { useState, KeyboardEvent } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';

import { FiTrash2 } from 'react-icons/fi';
import { BsThreeDots } from 'react-icons/bs';
import { BiMessageSquareEdit } from 'react-icons/bi';

import SizeForm from './components/SizeForm';
import Title from '@/layouts/dashboard/components/Title';
import Table from '@/layouts/dashboard/components/Table';
import {
   Button,
   Input,
   Dropdown,
   Skeleton,
   PageTitle,
   Pagination,
} from '@/components';

import { sizeApi } from '@/api';
import { ErrorResponse, ISize } from '@/types';
import { dateFormat, notify } from '@/helpers';

const DEFAULT_LIMIT = import.meta.env.VITE_APP_LIMIT || 15;

type Params = {
   name: string;
};

function Sizes() {
   const [sizeActive, setSizeActie] = useState<ISize | null>(null);

   const [skip, setSkip] = useState<number>(0);
   const [params, setParams] = useState<Params>({} as Params);

   const [openDrawer, setOpenDrawer] = useState<boolean>(false);

   const { t } = useTranslation(['dashboard', 'mutual']);

   const { isLoading, data, refetch } = useQuery({
      queryKey: ['sizes', skip, params],
      queryFn: () =>
         sizeApi.getAll({
            skip,
            limit: DEFAULT_LIMIT,
            ...params,
         }),
      keepPreviousData: true,
   });

   const deleteColorMutation = useMutation({
      mutationFn: (id: string) => {
         return sizeApi.delete(id);
      },
      onSuccess: () => {
         refetch();
         notify('success', 'Deleted successfully');
         console.log(deleteColorMutation.variables);
      },
      onError: (error: ErrorResponse) => {
         notify('error', error.message);
      },
   });

   const closeDrawer = () => {
      setOpenDrawer(false);
      setSizeActie(null);
   };

   const searchColor = (e: KeyboardEvent<HTMLInputElement>) => {
      const value = e.currentTarget.value.trim();

      setSkip(0);
      if (value) setParams({ name: value });
      else setParams({} as Params);
   };

   const onEdit = (size: ISize) => {
      setOpenDrawer(true);
      setSizeActie(size);
   };

   return (
      <>
         <PageTitle title='Sizes' />
         <Title title={t('title.size')} />
         <div className='flex flex-col mt-6'>
            <div className='flex justify-between mb-4 space-x-4 h-11'>
               <Input
                  type='text'
                  placeholder={t('placeholderSearch.searchByName')}
                  className='flex-1 h-full px-4'
                  onKeyDown={(e) => e.key === 'Enter' && searchColor(e)}
               />
               <Button
                  className='h-full text-sm duration-150 bg-green-500 w-52 hover:opacity-80'
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
                        <td className='w-[30%]'>{t('table.name')}</td>
                        <td className='w-[30%]'>{t('table.store')}</td>
                        <td className='w-[30%]'>{t('table.date')}</td>
                        <td className='w-[5%]'></td>
                     </tr>
                  }
                  pagination={
                     data &&
                     data.sizes.length > 0 && (
                        <Pagination
                           page={data.page}
                           lastPage={data.lastPage}
                           total={data.total}
                           currentTotal={data.sizes.length}
                           skip={skip}
                           setSkip={setSkip}
                        />
                     )
                  }
               >
                  {data && data.sizes.length > 0 ? (
                     data.sizes?.map((size, index: number) => (
                        <tr
                           key={index}
                           className={twMerge(
                              '[&>td:not(:first-child):not(:last-child)]:p-4',
                              deleteColorMutation.variables === size._id &&
                                 deleteColorMutation.isLoading &&
                                 'opacity-50'
                           )}
                        >
                           <td>
                              <p className='text-xs text-center text-gray-500'>
                                 {skip + index + 1}
                              </p>
                           </td>
                           <td>
                              <span className='uppercase line-clamp-1'>
                                 {size.name}
                              </span>
                           </td>
                           <td>
                              <span className='capitalize line-clamp-1'>
                                 {t(`store.${size.store}`, { ns: 'mutual' })}
                              </span>
                           </td>
                           <td>
                              <span>{dateFormat(size.createdAt)}</span>
                           </td>
                           <td>
                              <Dropdown
                                 items={[
                                    {
                                       label: (
                                          <div
                                             className='flex items-center space-x-2'
                                             onClick={() => onEdit(size)}
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
                                                deleteColorMutation.mutate(
                                                   size._id
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
            <SizeForm data={sizeActive} closeDrawer={closeDrawer} />
         </Drawer>
      </>
   );
}

export default Sizes;
