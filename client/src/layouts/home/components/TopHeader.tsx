import { useTranslation } from 'react-i18next';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { BiLogIn } from 'react-icons/bi';
import { TfiWorld } from 'react-icons/tfi';
import { FiChevronDown, FiUser } from 'react-icons/fi';

import { Dropdown } from '@/components';

import images from '@/assets/images';
import authStore from '@/stores/authStore';
import cartStore from '@/stores/cartStore';

const TopHeader = () => {
   const navigate = useNavigate();
   const { t, i18n } = useTranslation(['mutual']);
   const { currentUser, logOut, setPreviousLocation } = authStore();
   const { deleteCart } = cartStore();
   const changeLng = (lng: 'vi' | 'en') => {
      i18n.changeLanguage(lng);
   };
   const lng = i18n.language === 'vi' ? 'Tiếng việt' : 'English';

   const { pathname } = useLocation();

   return (
      <div className='text-xs'>
         <div className='container'>
            <div className='flex items-center justify-end space-x-5 h-9'>
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
                  <div className='flex items-center space-x-1 cursor-pointer'>
                     <TfiWorld size={14} />
                     <span>{lng}</span>
                     <FiChevronDown size={14} />
                  </div>
               </Dropdown>
               {currentUser ? (
                  <Dropdown
                     arrow={true}
                     border={false}
                     trigger={['hover']}
                     placement='bottomRight'
                     items={[
                        {
                           label: (
                              <Link
                                 to='/account/profile'
                                 className='inline-block px-3 py-2 space-x-2 text-sm font-medium cursor-pointer pr-7'
                              >
                                 {t('myAccount', { ns: 'home' })}
                              </Link>
                           ),
                        },
                        {
                           label: (
                              <Link
                                 to='/account/my-orders'
                                 className='inline-block px-3 py-2 space-x-2 text-sm font-medium cursor-pointer pr-7'
                              >
                                 {t('orders', { ns: 'home' })}
                              </Link>
                           ),
                        },
                        {
                           label: (
                              <span
                                 className='inline-block px-3 py-2 space-x-2 text-sm font-medium cursor-pointer pr-7'
                                 onClick={() => {
                                    logOut();
                                    deleteCart();
                                 }}
                              >
                                 {t('action.logOut')}
                              </span>
                           ),
                        },
                     ]}
                  >
                     <div className='flex items-center space-x-2'>
                        {currentUser.avatar ? (
                           <img
                              src={currentUser.avatar.url}
                              alt=''
                              className='w-6 rounded-full aspect-square'
                           />
                        ) : (
                           <FiUser size={18} />
                        )}
                        <span className='max-w-[150px] line-clamp-1'>
                           Hi, {currentUser.name}
                        </span>
                     </div>
                  </Dropdown>
               ) : (
                  <>
                     <div
                        className='flex items-center space-x-1 cursor-pointer'
                        onClick={() => {
                           navigate('/login');
                           setPreviousLocation(pathname);
                        }}
                     >
                        <BiLogIn size={18} />
                        <span>{t('action.login')}</span>
                     </div>
                  </>
               )}
            </div>
         </div>
      </div>
   );
};

// const AuthMainForm = () => {

// };

export default TopHeader;
