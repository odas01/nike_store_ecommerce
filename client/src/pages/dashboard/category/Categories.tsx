import { twMerge } from 'tailwind-merge';
import { Drawer } from 'antd';
import { useTranslation } from 'react-i18next';
import { useState, KeyboardEvent } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';

import { FiTrash2 } from 'react-icons/fi';
import { BsThreeDots } from 'react-icons/bs';
import { BiMessageSquareEdit } from 'react-icons/bi';

import Title from '@/layouts/dashboard/components/Title';
import {
   Tag,
   Modal,
   Input,
   Button,
   Skeleton,
   PageTitle,
   Pagination,
} from '@/components';
import { Dropdown } from '@/components';
import CategoryForm from './components/CategoryForm';
import Table from '@/layouts/dashboard/components/Table';

import { categoryApi } from '@/api';
import { dateFormat, notify } from '@/helpers';
import { ErrorResponse, ICategory } from '@/types';
import { store } from '@/constants';

const DEFAULT_LIMIT = import.meta.env.VITE_APP_LIMIT || 15;

type Params = {
   name: string;
};

type Store = (typeof store)[number];

function Categories() {
   const [categoryActive, setCategoryActive] = useState<ICategory | null>(null);

   const [skip, setSkip] = useState<number>(0);
   const [params, setParams] = useState<Params>({} as Params);

   const [openDrawer, setOpenDrawer] = useState<boolean>(false);
   const [openModal, setOpenModal] = useState<boolean>(false);

   const { t, i18n } = useTranslation(['dashboard', 'mutual']);

   const { data, isLoading, refetch } = useQuery({
      queryKey: ['categories', skip, params],
      queryFn: () =>
         categoryApi.getAll({ skip, limit: DEFAULT_LIMIT, ...params }),
      keepPreviousData: true,
   });

   const deleteCateMutation = useMutation({
      mutationFn: (id: string) => {
         return categoryApi.delete(id);
      },
      onSuccess: () => {
         notify('success', 'Deleted successfully.');
         refetch();
      },
      onError: (error: ErrorResponse) => {
         notify('error', error.message);
      },
   });

   const closeDrawer = () => {
      setOpenDrawer(false);
      setCategoryActive(null);
   };

   const searchAdmin = (e: KeyboardEvent<HTMLInputElement>) => {
      const value = e.currentTarget.value.trim();

      setSkip(0);
      if (value) setParams({ name: value });
      else setParams({} as Params);
   };

   const onEdit = (category: ICategory) => {
      setOpenDrawer(true);
      setCategoryActive(category);
   };

   return (
      <>
         <PageTitle title='Categories' />
         <Title title={t('category.title')} />
         <div className='flex flex-col mt-6'>
            <div className='flex mb-4 space-x-4 h-11'>
               <Input
                  type='text'
                  placeholder={t('placeholderSearch.searchByName')}
                  className='flex-1 h-full px-4'
                  onKeyDown={(e) => e.key === 'Enter' && searchAdmin(e)}
               />
               <Button
                  className='h-full text-sm duration-150 bg-green-500 w-52 hover:bg-green-600'
                  onClick={() => setOpenDrawer(true)}
               >
                  + {t('action.addNew')}
               </Button>
            </div>
            {isLoading ? (
               <Skeleton />
            ) : (
               <Table
                  heading={
                     <tr className='[&>*:not(:last-child)]:px-4 [&>*]:py-3'>
                        <td className='w-[5%]'></td>
                        <td className='w-[25%]'>
                           {t('label.name', { ns: 'mutual' })}
                        </td>
                        <td className='w-[25%]'>
                           {t('label.vnName', { ns: 'mutual' })}
                        </td>
                        <td className='w-[20%]'>
                           {t('label.store', { ns: 'mutual' })}
                        </td>
                        <td className='w-[20%]'>
                           {t('label.date', { ns: 'mutual' })}
                        </td>
                        <td className='w-[5%]'></td>
                     </tr>
                  }
                  pagination={
                     data &&
                     data.categories.length > 0 && (
                        <Pagination
                           page={data.page}
                           lastPage={data.lastPage}
                           total={data.total}
                           currentTotal={data.categories.length}
                           skip={skip}
                           setSkip={setSkip}
                        />
                     )
                  }
               >
                  {data && data.categories.length > 0 ? (
                     data.categories?.map((category, index) => (
                        <tr
                           key={index}
                           className={twMerge(
                              '[&>td:not(:first-child):not(:last-child)]:p-4',
                              deleteCateMutation.variables === category._id &&
                                 deleteCateMutation.isLoading &&
                                 'opacity-50'
                           )}
                        >
                           <td>
                              <p className='text-xs text-center text-gray-500'>
                                 {skip + index + 1}
                              </p>
                           </td>
                           <td>
                              <span className='capitalize'>
                                 {category.name}
                              </span>
                           </td>
                           <td>
                              <span className='capitalize'>
                                 {category.vnName}
                              </span>
                           </td>
                           <td>
                              <span className='capitalize'>
                                 {t(`store.${category.store as Store}`, {
                                    ns: 'mutual',
                                 })}
                              </span>
                           </td>
                           <td>
                              <span>{dateFormat(category.createdAt)}</span>
                           </td>
                           <td>
                              <Dropdown
                                 items={[
                                    {
                                       label: (
                                          <div
                                             className='flex items-center px-2 py-1 space-x-2'
                                             onClick={() => onEdit(category)}
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
                                                deleteCateMutation.mutate(
                                                   category._id
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
            <CategoryForm data={categoryActive} closeDrawer={closeDrawer} />
         </Drawer>

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

export default Categories;
