import { useTranslation } from 'react-i18next';
import { Outlet, Navigate, Link } from 'react-router-dom';

import images from '@/assets/images';
import authStore from '@/stores/authStore';
import { TfiWorld } from 'react-icons/tfi';
import { FiChevronDown } from 'react-icons/fi';
import { Dropdown } from '@/components';

function AuthLayout() {
   const { currentUser } = authStore();

   const { t, i18n } = useTranslation(['dashboard', 'home']);
   const changeLng = (lng: 'vi' | 'en') => {
      i18n.changeLanguage(lng);
   };
   const lng = i18n.language === 'vi' ? 'Tiếng việt' : 'English';

   if (currentUser) {
      return <Navigate to='/' />;
   }

   return (
      <div
         className='relative flex items-center flex-col min-h-screen py-12 bg-top bg-no-repeat bg-cover'
         style={{ backgroundImage: `url(${images.auth_bg})` }}
      >
         <h2 className='text-5xl font-nikeFutura'>Welcome</h2>
         <div className='w-1/3'>
            <Outlet />
         </div>
         <Link to='/' className='fixed top-4 left-4 w-36 h-8'>
            <img src={images.auth_logo} alt='logo' />
         </Link>
         <div className='fixed right-4 top-4 space-y-3'>
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
               <div className='cursor-pointer px-4'>
                  <TfiWorld size={14} />
               </div>
            </Dropdown>
         </div>
      </div>
   );
}

export default AuthLayout;
