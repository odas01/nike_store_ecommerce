import { useTranslation } from 'react-i18next';
import { Outlet, Navigate, Link } from 'react-router-dom';

import { TfiWorld } from 'react-icons/tfi';

import { Dropdown } from '@/components';

import images from '@/assets/images';
import authStore from '@/stores/authStore';

function AuthLayout() {
   const { currentUser, previousLocation } = authStore();

   const { i18n } = useTranslation(['dashboard', 'home']);
   const changeLng = (lng: 'vi' | 'en') => {
      i18n.changeLanguage(lng);
   };

   if (currentUser) {
      return <Navigate to={previousLocation} />;
   }

   return (
      <div
         className='relative flex flex-col items-center min-h-screen py-12 bg-top bg-no-repeat bg-cover'
         style={{ backgroundImage: `url(${images.auth_bg})` }}
      >
         <h2 className='text-5xl font-nikeFutura'>Welcome</h2>
         <div className='w-1/3'>
            <Outlet />
         </div>
         <Link to='/' className='fixed h-8 top-4 left-4 w-36'>
            <img src={images.auth_logo} alt='logo' />
         </Link>
         <div className='fixed space-y-3 right-4 top-4'>
            <Dropdown
               arrow={true}
               border={false}
               placement='bottomRight'
               trigger={['click']}
               items={[
                  {
                     label: (
                        <div
                           className='flex items-center px-3 py-2 space-x-2 cursor-pointer'
                           onClick={() => changeLng('vi')}
                        >
                           <img
                              src={images.flag.vi}
                              className='w-5 rounded-sm'
                              alt='flag'
                           />
                           <span className='text-xs'> Tiếng Việt</span>
                        </div>
                     ),
                  },
                  {
                     label: (
                        <div
                           className='flex items-center px-3 py-2 space-x-2 cursor-pointer'
                           onClick={() => changeLng('en')}
                        >
                           <img
                              src={images.flag.en}
                              className='w-5 rounded-sm'
                              alt='flag'
                           />
                           <span className='text-xs'>English</span>
                        </div>
                     ),
                  },
               ]}
            >
               <div className='px-4 cursor-pointer'>
                  <TfiWorld size={14} />
               </div>
            </Dropdown>
         </div>
      </div>
   );
}

export default AuthLayout;
