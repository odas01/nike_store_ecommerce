import { useTranslation } from 'react-i18next';
import { useState, KeyboardEvent } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';

import { FiTrash2 } from 'react-icons/fi';
import { BsThreeDots } from 'react-icons/bs';
import { AiOutlineLock, AiOutlineUnlock } from 'react-icons/ai';

import Title from '@/layouts/dashboard/components/Title';
import Table from '@/layouts/dashboard/components/Table';
import {
   Tag,
   Input,
   Skeleton,
   Dropdown,
   PageTitle,
   Pagination,
} from '@/components';

import { userApi } from '@/api';
import { dateFormat, notify } from '@/helpers';
import { UserFormUpdate } from '@/types';

const DEFAULT_LIMIT = import.meta.env.VITE_APP_LIMIT || 15;

type Params = {
   search: string;
};

function Customers() {
   const [skip, setSkip] = useState<number>(0);
   const [params, setParams] = useState<Params>({} as Params);

   const { t, i18n } = useTranslation(['dashboard', 'mutual']);
   const isVnLang = i18n.language === 'vi';
   const { data, isLoading, refetch } = useQuery({
      queryKey: ['customers', skip, params],
      queryFn: () =>
         userApi.getAll({
            skip,
            limit: DEFAULT_LIMIT,
            role: 'customer',
            ...params,
         }),
      keepPreviousData: true,
   });

   const blockCustomerMutation = useMutation({
      mutationFn: ({ id, values }: { id: string; values: UserFormUpdate }) => {
         return userApi.update(id, values);
      },
      onSuccess: ({ message }) => {
         refetch();
         notify('success', isVnLang ? message.vi : message.en);
      },

      onError: ({ message }) => {
         notify('error', isVnLang ? message.vi : message.en);
      },
   });

   const searchUser = (e: KeyboardEvent<HTMLInputElement>) => {
      const value = e.currentTarget.value.trim();

      setSkip(0);
      if (value) setParams({ search: value });
      else setParams({} as Params);
   };

   return (
      <>
         <PageTitle title='Customers' />
         <Title title={t('customer.title')} />
         <div className='flex flex-col mt-6'>
            <div className='mb-4 h-11'>
               <Input
                  type='text'
                  placeholder={t('placeholderSearch.searchByNamePhoneEmail')}
                  className='w-full h-full px-4'
                  onKeyDown={(e) => e.key === 'Enter' && searchUser(e)}
               />
            </div>
            {isLoading ? (
               <Skeleton />
            ) : (
               <Table
                  heading={
                     <tr className='[&>*:not(:last-child)]:p-4'>
                        <td className='w-[5%]'></td>
                        <td className='w-[15%]'>
                           {t('label.date', {
                              ns: 'mutual',
                           })}
                        </td>
                        <td className='w-[25%]'>
                           {t('label.name', {
                              ns: 'mutual',
                           })}
                        </td>
                        <td className='w-[25%]'>Email</td>
                        <td className='w-[15%]'>
                           {t('label.phone', {
                              ns: 'mutual',
                           })}
                        </td>
                        <td className='w-[10%] text-center'>
                           {t('status.status', {
                              ns: 'mutual',
                           })}
                        </td>
                        <td className='w-[5%]'></td>
                     </tr>
                  }
                  pagination={
                     data &&
                     data.users.length > 0 && (
                        <Pagination
                           page={data.page}
                           lastPage={data.lastPage}
                           total={data.total}
                           currentTotal={data.users.length}
                           skip={skip}
                           setSkip={setSkip}
                        />
                     )
                  }
               >
                  {data && data.users.length > 0 ? (
                     data.users?.map((user, index) => (
                        <tr
                           key={index}
                           className='[&>td:not(:first-child):not(:last-child)]:p-4'
                        >
                           <td>
                              <p className='text-xs text-center text-gray-500'>
                                 {skip + index + 1}
                              </p>
                           </td>
                           <td>
                              <span>{dateFormat(user.createdAt)}</span>
                           </td>
                           <td>
                              <span className='line-clamp-1'>{user.name}</span>
                           </td>
                           <td>
                              <span className='line-clamp-1'>{user.email}</span>
                           </td>
                           <td>
                              <span>{user.phone}</span>
                           </td>
                           <td className='flex justify-center'>
                              {user.status === 'active' ? (
                                 <Tag
                                    title={t('status.active', {
                                       ns: 'mutual',
                                    })}
                                 />
                              ) : (
                                 <Tag
                                    title={t('status.blocked', {
                                       ns: 'mutual',
                                    })}
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
                                             className='flex items-center px-2 py-1 space-x-2'
                                             onClick={() => {
                                                const status =
                                                   user.status === 'active'
                                                      ? 'blocked'
                                                      : 'active';

                                                blockCustomerMutation.mutate({
                                                   id: user._id,
                                                   values: {
                                                      status,
                                                   },
                                                });
                                             }}
                                          >
                                             {user.status === 'active' ? (
                                                <>
                                                   <AiOutlineLock />
                                                   <span>
                                                      {t('action.block', {
                                                         ns: 'mutual',
                                                      })}
                                                   </span>
                                                </>
                                             ) : (
                                                <>
                                                   <AiOutlineUnlock />
                                                   <span>
                                                      {t('action.unblock', {
                                                         ns: 'mutual',
                                                      })}
                                                   </span>
                                                </>
                                             )}
                                          </div>
                                       ),
                                    },
                                    {
                                       label: (
                                          <div
                                             className='flex items-center px-2 py-1 space-x-2'
                                             onClick={() => {
                                                // deleteAdmin(user._id)
                                             }}
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
      </>
   );
}

export default Customers;
