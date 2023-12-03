import { twMerge } from 'tailwind-merge';
import { Drawer } from 'antd';
import { useTranslation } from 'react-i18next';
import { useState, KeyboardEvent } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';

import { FiTrash2 } from 'react-icons/fi';
import { BsThreeDots } from 'react-icons/bs';
import { BiMessageSquareEdit } from 'react-icons/bi';

import ColorForm from './components/ColorForm';
import Title from '@/layouts/dashboard/components/Title';
import Table from '@/layouts/dashboard/components/Table';
import {
   Input,
   Button,
   Dropdown,
   PageTitle,
   Pagination,
   Loading,
} from '@/components';

import { colorApi } from '@/api';
import { dateFormat, notify } from '@/helpers';
import { IColor } from '@/types';

const DEFAULT_LIMIT = import.meta.env.VITE_APP_LIMIT || 15;

type Params = {
   name: string;
};

function Colors() {
   const [colorActive, setColorActive] = useState<IColor | null>(null);

   const [skip, setSkip] = useState<number>(0);
   const [params, setParams] = useState<Params>({} as Params);

   const [openDrawer, setOpenDrawer] = useState<boolean>(false);

   const { t, i18n } = useTranslation(['dashboard', 'mutual']);
   const isVnLang = i18n.language === 'vi';
   const { isLoading, data, refetch } = useQuery({
      queryKey: ['colors', skip, params],
      queryFn: () =>
         colorApi.getAll({
            skip,
            limit: DEFAULT_LIMIT,
            ...params,
         }),
      keepPreviousData: true,
   });

   const deleteColorMutation = useMutation({
      mutationFn: (id: string) => {
         return colorApi.delete(id);
      },
      onSuccess: ({ message }) => {
         notify('success', isVnLang ? message.vi : message.en);
         refetch();
      },

      onError: ({ message }) => {
         notify('error', isVnLang ? message.vi : message.en);
      },
   });

   const closeDrawer = () => {
      setOpenDrawer(false);
      setColorActive(null);
   };

   const searchColor = (e: KeyboardEvent<HTMLInputElement>) => {
      const value = e.currentTarget.value.trim();

      setSkip(0);
      if (value) setParams({ name: value });
      else setParams({} as Params);
   };

   const onEdit = (color: IColor) => {
      setOpenDrawer(true);
      setColorActive(color);
   };

   return (
      <>
         <PageTitle title='Colors' />
         <Title title={t('color.title')} />
         <div className='flex flex-col mt-6'>
            <div className='flex justify-between mb-4 space-x-4 h-11'>
               <Input
                  type='text'
                  placeholder={t('placeholderSearch.searchByName')}
                  className='flex-1 h-full px-4'
                  onKeyDown={(e) => e.key === 'Enter' && searchColor(e)}
               />
               <Button
                  className='h-full text-sm duration-150 bg-green-500 w-52 hover:bg-green-600'
                  onClick={() => setOpenDrawer(true)}
               >
                  + {t('action.addNew')}
               </Button>
            </div>
            {isLoading ? (
               <Loading />
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
                           {t('label.hexCode', { ns: 'mutual' })}
                        </td>
                        <td className='w-[20%]'>
                           {t('label.date', { ns: 'mutual' })}
                        </td>
                        <td className='w-[5%]'></td>
                     </tr>
                  }
                  pagination={
                     data &&
                     data.colors.length > 0 && (
                        <Pagination
                           page={data.page}
                           lastPage={data.lastPage}
                           total={data.total}
                           currentTotal={data.colors.length}
                           skip={skip}
                           setSkip={setSkip}
                           limit={DEFAULT_LIMIT}
                        />
                     )
                  }
               >
                  {data && data.colors.length > 0 ? (
                     data.colors?.map((color, index) => (
                        <tr
                           key={index}
                           className={twMerge(
                              '[&>td:not(:first-child):not(:last-child)]:p-4',
                              deleteColorMutation.variables === color._id &&
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
                              <span className='capitalize line-clamp-1'>
                                 {color.name}
                              </span>
                           </td>
                           <td>
                              <span className='capitalize line-clamp-1'>
                                 {color.vnName}
                              </span>
                           </td>
                           <td>
                              <div className='flex items-center space-x-2 uppercase'>
                                 <span
                                    className='h-5 rounded-full aspect-square'
                                    style={{
                                       backgroundColor: color.value,
                                    }}
                                 />
                                 <span>{color.value}</span>
                              </div>
                           </td>
                           <td>
                              <span>{dateFormat(color.createdAt)}</span>
                           </td>
                           <td>
                              <Dropdown
                                 items={[
                                    {
                                       label: (
                                          <div
                                             className='flex items-center px-2 py-1 space-x-2'
                                             onClick={() => onEdit(color)}
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
                                                deleteColorMutation.mutate(
                                                   color._id
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
            <ColorForm data={colorActive} closeDrawer={closeDrawer} />
         </Drawer>
      </>
   );
}

export default Colors;
