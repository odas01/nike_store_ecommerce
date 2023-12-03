import * as zod from 'zod';
import { Drawer, Modal } from 'antd';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useState, KeyboardEvent } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';

import { FiTrash2 } from 'react-icons/fi';
import { MdPassword } from 'react-icons/md';
import { BsThreeDots } from 'react-icons/bs';
import { BiMessageSquareEdit } from 'react-icons/bi';

import AdminForm from './components/AdminForm';
import Title from '@/layouts/dashboard/components/Title';
import Table from '@/layouts/dashboard/components/Table';
import {
   Tag,
   Input,
   Button,
   Dropdown,
   PageTitle,
   Pagination,
   Loading,
} from '@/components';

import { authApi, userApi } from '@/api';
import { dateFormat, notify } from '@/helpers';
import { IUser } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';

const DEFAULT_LIMIT = import.meta.env.VITE_APP_LIMIT || 15;

type Params = {
   search: string;
};

const formSchema = zod.object({
   newPassword: zod.string().nonempty('New password is required'),
});

type FormValues = zod.infer<typeof formSchema>;

function Admins() {
   const [userActive, setUserActive] = useState<IUser | null>(null);
   const [skip, setSkip] = useState<number>(0);
   const [params, setParams] = useState<Params>({} as Params);
   const [openDrawer, setOpenDrawer] = useState<boolean>(false);
   const [openModal, setOpenModal] = useState<boolean>(false);

   const { t, i18n } = useTranslation(['dashboard', 'mutual']);
   const isVnLang = i18n.language === 'vi';

   const { register, handleSubmit } = useForm<FormValues>({
      resolver: zodResolver(formSchema),
      mode: 'onChange',
   });

   const { data, isLoading, refetch } = useQuery({
      queryKey: ['admins', skip, params],
      queryFn: () =>
         userApi.getAll({
            skip: skip * DEFAULT_LIMIT,
            limit: DEFAULT_LIMIT,
            role: 'admin',
            ...params,
         }),
   });

   const deleteAdminMutation = useMutation({
      mutationFn: (id: string) => userApi.delete(id),
      onSuccess: ({ message }) => {
         refetch();
         notify('success', isVnLang ? message.vi : message.en);
      },

      onError: ({ message }) => {
         notify('error', isVnLang ? message.vi : message.en);
      },
   });
   const changePasswordMutation = useMutation({
      mutationFn: ({ id, newPassword }: { id: string; newPassword: string }) =>
         authApi.adminChangePassword(id, newPassword),
      onSuccess: ({ message }) => {
         refetch();
         notify('success', isVnLang ? message.vi : message.en);
      },

      onError: ({ message }) => {
         notify('error', isVnLang ? message.vi : message.en);
      },
   });

   const closeDrawer = () => {
      setOpenDrawer(false);
      setUserActive(null);
   };

   const searchAdmin = (e: KeyboardEvent<HTMLInputElement>) => {
      const value = e.currentTarget.value.trim();

      setSkip(0);
      if (value) setParams({ search: value });
      else setParams({} as Params);
   };

   const onEdit = (user: IUser) => {
      setOpenDrawer(true);
      setUserActive(user);
   };

   const onChangePassword = (user: IUser) => {
      setOpenModal(true);
      setUserActive(user);
   };

   const onSubmit = handleSubmit((values) => {
      changePasswordMutation.mutate({
         id: userActive?._id!,
         newPassword: values.newPassword,
      });
   });

   return (
      <>
         <PageTitle title='Admins' />
         <Title title={t('admin.title')} />
         <div className='flex flex-col mt-6'>
            <div className='flex justify-between mb-4 space-x-4 h-11'>
               <Input
                  type='text'
                  placeholder={t('placeholderSearch.searchByNamePhoneEmail')}
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
               <Loading />
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
                                             onClick={() =>
                                                onChangePassword(user)
                                             }
                                          >
                                             <MdPassword />

                                             <span>
                                                {t('action.changePasswordd', {
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
                                             onClick={() => onEdit(user)}
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
                                                deleteAdminMutation.mutate(
                                                   user._id
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
            <AdminForm data={userActive} closeDrawer={closeDrawer} />
         </Drawer>

         <Modal
            title={null}
            open={openModal}
            onCancel={() => setOpenModal(false)}
            footer={null}
            className='bg-white dark:bg-[#1A1C23] text-black dark:text-white !pb-0 rounded-lg'
         >
            <h2 className='mb-4 text-lg'>
               {t('action.changePasswordd', { ns: 'mutual' })}
            </h2>
            <Input className='w-full' {...register('newPassword')} />
            <div className='flex justify-end mt-4 space-x-3'>
               <div
                  className='flex items-center px-3 py-1.5 space-x-2  dark:text-white border rounded cursor-pointer text-11'
                  onClick={() => setOpenModal(false)}
               >
                  <span>{t('action.cancel', { ns: 'mutual' })} </span>
               </div>
               <div
                  className='flex items-center px-3 py-1.5 space-x-2  dark:text-white border rounded cursor-pointer text-11'
                  onClick={onSubmit}
               >
                  <span>
                     {/* {t('action.changePasswordd', { ns: 'mutual' })}  */}
                     Ok
                  </span>
               </div>
            </div>
         </Modal>
      </>
   );
}

export default Admins;
