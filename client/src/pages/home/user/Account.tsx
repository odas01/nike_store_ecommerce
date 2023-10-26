import authStore from '@/stores/authStore';
import { Col, Row } from 'antd';
import { AiOutlineProfile } from 'react-icons/ai';
import { FiLogOut } from 'react-icons/fi';
import { MdPassword } from 'react-icons/md';
import { TfiMenuAlt } from 'react-icons/tfi';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import images from '@/assets/images';
import cartStore from '@/stores/cartStore';

const Account = () => {
   const { deleteCart } = cartStore();
   const { currentUser, logOut } = authStore();
   const avatar = currentUser?.avatar?.url || images.user;

   const navigate = useNavigate();
   const { t } = useTranslation(['home', 'dashboard', 'mutual']);

   return (
      <div className='container py-5'>
         <Row gutter={36}>
            <Col span={6}>
               <div className='p-7 pb-12 space-y-6 bg-[#F9FAFB] rounded'>
                  <div className='flex items-center space-x-2'>
                     <div className='w-8 overflow-hidden rounded-full aspect-square'>
                        <img src={avatar} alt='avatar' />
                     </div>
                     <span className='font-semibold '>{currentUser?.name}</span>
                  </div>
                  <div className='flex flex-col space-y-4'>
                     <Link
                        to='my-orders'
                        className='flex items-center space-x-2 duration-75 hover:opacity-80'
                     >
                        <TfiMenuAlt size={16} />
                        <span>{t('orders')}</span>
                     </Link>
                     <Link
                        to='change-password'
                        className='flex items-center space-x-2 duration-75 hover:opacity-80'
                     >
                        <MdPassword size={16} />

                        <span>{t('changePass')}</span>
                     </Link>
                     <Link
                        to='profile'
                        className='flex items-center space-x-2 duration-75 hover:opacity-80'
                     >
                        <AiOutlineProfile size={16} />

                        <span>{t('updateProfile')}</span>
                     </Link>
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
            <Col span={18}>
               <div className='p-5 bg-[#F9FAFB] rounded min-h-full'>
                  <Outlet />
               </div>
            </Col>
         </Row>
      </div>
   );
};

export default Account;
