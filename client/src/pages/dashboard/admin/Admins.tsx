import { useState, KeyboardEvent } from 'react';
import { useTranslation } from 'react-i18next';
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
   Modal,
   Input,
   Button,
   Skeleton,
   Dropdown,
   PageTitle,
   Pagination,
} from '@/components';

import { userApi } from '@/api';
import { dateFormat, notify } from '@/helpers';
import { ErrorResponse, IUser } from '@/types';
import { Drawer } from 'antd';

const DEFAULT_LIMIT = import.meta.env.VITE_APP_LIMIT || 15;

type Params = {
   search: string;
};

function Admins() {
   const [userActive, setUserActive] = useState<IUser | null>(null);

   const [skip, setSkip] = useState<number>(0);
   const [params, setParams] = useState<Params>({} as Params);

   const [openDrawer, setOpenDrawer] = useState<boolean>(false);
   const [openModal, setOpenModal] = useState<boolean>(false);

   const { t } = useTranslation('dashboard');

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
      onSuccess: () => {
         refetch();
         notify('success', 'Deleted admin successfully');
      },
      onError: (error: ErrorResponse) => {
         notify('error', error.message);
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

   return (
      <>
         <PageTitle title='Admins' />
         <Title title={t('title.admin')} />
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
                  {t('form.addNew')}
               </Button>
            </div>
            {isLoading ? (
               <Skeleton />
            ) : (
               <Table
                  heading={
                     <tr className='[&>*:not(:last-child)]:p-4'>
                        <td className='w-[5%]'></td>
                        <td className='w-[15%]'>{t('table.date')}</td>
                        <td className='w-[20%]'>{t('table.name')}</td>
                        <td className='w-[25%]'>Email</td>
                        <td className='w-[15%]'>{t('table.phoneNumber')}</td>
                        <td className='w-[10%] text-center'>
                           {t('status.status')}
                        </td>
                        <td className='w-[10%]'></td>
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
                                 <Tag title={t('status.active')} />
                              ) : (
                                 <Tag
                                    title={t('status.blocked')}
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
                                             className='flex items-center space-x-2'
                                             onClick={() =>
                                                onChangePassword(user)
                                             }
                                          >
                                             <MdPassword />

                                             <span>
                                                {t('form.changePassword')}
                                             </span>
                                          </div>
                                       ),
                                    },
                                    {
                                       label: (
                                          <div
                                             className='flex items-center space-x-2'
                                             onClick={() => onEdit(user)}
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
                                                deleteAdminMutation.mutate(
                                                   user._id
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
            <AdminForm
               data={userActive}
               getData={() => {}}
               closeDrawer={closeDrawer}
            />
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

export default Admins;
