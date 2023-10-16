import { twMerge } from 'tailwind-merge';
import ReactDrawer from 'react-modern-drawer';
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
   Skeleton,
   PageTitle,
   Pagination,
} from '@/components';

import { dateFormat, notify } from '@/helpers';
import { ErrorResponse, IColor } from '@/types';
import { colorApi } from '@/api';

const DEFAULT_LIMIT = import.meta.env.VITE_APP_LIMIT || 15;

type Params = {
   name: string;
};

function Colors() {
   const [colorActive, setColorActive] = useState<IColor | null>(null);

   const [skip, setSkip] = useState<number>(0);
   const [params, setParams] = useState<Params>({} as Params);

   const [openDrawer, setOpenDrawer] = useState<boolean>(false);

   const { t } = useTranslation('dashboard');

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
         <Title title={t('title.color')} />
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
                        <td className='w-[30%]'>{t('table.name')} </td>
                        <td className='w-[30%]'>{t('table.date')} </td>
                        <td className='w-[25%]'>{t('table.date')} </td>
                        <td className='w-[10%]'></td>
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
                              <div className='flex items-center space-x-2 uppercase'>
                                 <span
                                    className='h-5 rounded-full aspect-square'
                                    style={{
                                       backgroundColor: color.value,
                                    }}
                                 ></span>
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
                                             className='flex items-center space-x-2'
                                             onClick={() => onEdit(color)}
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
                                                   color._id
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

         <ReactDrawer
            open={openDrawer}
            onClose={closeDrawer}
            direction='right'
            size='40%'
         >
            <ColorForm data={colorActive} closeDrawer={closeDrawer} />
         </ReactDrawer>
      </>
   );
}

export default Colors;
