import { Col, Row } from 'antd';
import { useTranslation } from 'react-i18next';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import authStore from '@/stores/authStore';

import { FiLogOut } from 'react-icons/fi';
import { MdPassword } from 'react-icons/md';
import { TfiMenuAlt } from 'react-icons/tfi';
import { AiOutlineProfile } from 'react-icons/ai';

import images from '@/assets/images';
import cartStore from '@/stores/cartStore';

const Account = () => {
   const { deleteCart } = cartStore();
   const { currentUser, logOut } = authStore();
   const avatar = currentUser?.avatar?.url || images.user;

   const navigate = useNavigate();
   const { t } = useTranslation(['home', 'dashboard', 'mutual']);

   return (
      <div className='space-y-6 mobile:pt-4 mobile:px-2'>
         <Row
            gutter={[
               0,
               {
                  xs: 12,
               },
            ]}
         >
            <Col xl={6} xs={0}>
               <div className='p-7 pb-12 space-y-6 bg-[#F9FAFB] rounded'>
                  <div className='flex items-center space-x-2'>
                     <div className='w-8 overflow-hidden rounded-full aspect-square'>
                        <img src={avatar} alt='avatar' />
                     </div>
                     <span className='font-semibold '>{currentUser?.name}</span>
                  </div>
                  <div className='flex flex-col space-y-4'>
                     <NavLink
                        to='profile'
                        className={({ isActive }) =>
                           `flex items-center space-x-2 duration-100 hover:font-medium ${
                              isActive ? 'font-medium' : ''
                           }`
                        }
                     >
                        <AiOutlineProfile size={16} />

                        <span>{t('updateProfile')}</span>
                     </NavLink>
                     <NavLink
                        to='my-orders'
                        className={({ isActive }) =>
                           `flex items-center space-x-2 duration-100 hover:font-medium ${
                              isActive ? 'font-medium' : ''
                           }`
                        }
                     >
                        <TfiMenuAlt size={16} />
                        <span>{t('history')}</span>
                     </NavLink>
                     <NavLink
                        to='change-password'
                        className={({ isActive }) =>
                           `flex items-center space-x-2 duration-100 hover:font-medium ${
                              isActive ? 'font-medium' : ''
                           }`
                        }
                     >
                        <MdPassword size={16} />

                        <span>{t('changePass')}</span>
                     </NavLink>
                     <div
                        className='flex items-center space-x-2 duration-75 cursor-pointer hover:opacity-80'
                        onClick={() => {
                           logOut();
                           deleteCart();
                           navigate('/');
                        }}
                     >
                        <FiLogOut size={16} />
                        <span>{t('action.logOut', { ns: 'mutual' })}</span>
                     </div>
                  </div>
               </div>
            </Col>
            <Col xl={18} xs={24}>
               <div className='xl:p-5 md:p-2 md:bg-[#F9FAFB] rounded min-h-full'>
                  <Outlet />
               </div>
            </Col>
         </Row>
      </div>
   );
};

export default Account;
