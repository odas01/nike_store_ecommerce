import { useContext } from 'react';
import { useTranslation } from 'react-i18next';

import { CiLogout } from 'react-icons/ci';
import { BsSun, BsMoon } from 'react-icons/bs';
import { GiWorld } from 'react-icons/gi';
import { LuLayoutDashboard } from 'react-icons/lu';

import { Dropdown } from '@/components';

import images from '@/assets/images';
import authStore from '@/stores/authStore';
import { ThemeContext } from '@/route/ThemeRoute';
import { BiUser } from 'react-icons/bi';
import { Link } from 'react-router-dom';

function Header() {
   const { isDarkMode, setIsDarkMode } = useContext(ThemeContext);
   const { currentUser, logOut } = authStore();

   const { t, i18n } = useTranslation(['dashboard', 'mutual']);
   const lng = i18n.language === 'vi' ? 'Tiếng việt' : 'English';

   const changeLng = (lng: 'vi' | 'en') => {
      i18n.changeLanguage(lng);
   };

   return (
      <div className='flex justify-end items-center py-4 mb-4 border-b border-[#e8e8e8] dark:border-[rgb(58,58,58)]'>
         <div className='flex items-center justify-end h-8'>
            <div className='mr-6'>
               <Dropdown
                  trigger={['click']}
                  placement='bottomRight'
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
                  <div className='flex items-center pb-1 space-x-1 cursor-pointer'>
                     <GiWorld />
                     <span className='text-xs'>{lng}</span>
                  </div>
               </Dropdown>
            </div>

            <div
               className='flex justify-center items-center mr-6 h-full aspect-square rounded cursor-pointer shadow-[0px_2px_2px_rgba(0,0,0,0.3)] dark:shadow-[0px_2px_2px_rgba(255,255,255,0.3)]'
               onClick={() => setIsDarkMode(!isDarkMode)}
            >
               {isDarkMode ? <BsSun color='#fff' /> : <BsMoon />}
            </div>
            <div className='mr-2 overflow-hidden border rounded-full aspect-square dark:border-white'>
               <Dropdown
                  trigger={['hover']}
                  items={[
                     {
                        label: (
                           <Link
                              to='/dashboard'
                              className='flex items-center py-2 pl-3 pr-6 space-x-2'
                           >
                              <LuLayoutDashboard />
                              <span>Dashboard</span>
                           </Link>
                        ),
                     },
                     {
                        label: (
                           <Link
                              to={`/dashboard/profile/${currentUser?._id}`}
                              className='flex items-center py-2 pl-3 pr-6 space-x-2'
                           >
                              <BiUser />
                              <span>
                                 {t('action.profileSetting', { ns: 'mutual' })}
                              </span>
                           </Link>
                        ),
                     },
                     {
                        label: (
                           <div
                              className='flex items-center py-2 pl-3 pr-6 space-x-2'
                              onClick={logOut}
                           >
                              <CiLogout />
                              <span>
                                 {t('action.logOut', { ns: 'mutual' })}
                              </span>
                           </div>
                        ),
                     },
                  ]}
                  placement='top'
               >
                  <img
                     src={currentUser?.avatar?.url || ''}
                     className='w-8 aspect-square'
                     alt='avatar'
                  />
               </Dropdown>
            </div>
         </div>
      </div>
   );
}

export default Header;
