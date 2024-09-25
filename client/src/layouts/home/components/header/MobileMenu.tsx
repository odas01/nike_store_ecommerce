import authStore from '@/stores/authStore';
import cartStore from '@/stores/cartStore';
import { Drawer } from 'antd';
import { Dispatch, FC, SetStateAction, useEffect } from 'react';
import { PiSneakerMove } from 'react-icons/pi';
import { useTranslation } from 'react-i18next';
import { NavLink, Link, useLocation, useNavigate } from 'react-router-dom';
import { MdOutlineShoppingBag, MdPassword } from 'react-icons/md';
import { GiClothes } from 'react-icons/gi';
import { FaRedhat } from 'react-icons/fa';
import { AiOutlineProfile } from 'react-icons/ai';
import { TfiMenuAlt } from 'react-icons/tfi';
import { Logo } from '@/components';
import images from '@/assets/images';

interface IMobileMenuProps {
   open: boolean;
   setOpen: Dispatch<SetStateAction<boolean>>;
}

const MobileMenu: FC<IMobileMenuProps> = ({ open, setOpen }) => {
   const { t, i18n } = useTranslation(['home', 'mutual']);
   const isVnLang = i18n.language === 'vi';
   const changeLng = (lng: 'vi' | 'en') => {
      i18n.changeLanguage(lng);
   };
   const { currentUser, logOut, setPreviousLocation } = authStore();
   const { deleteCart } = cartStore();
   const { pathname } = useLocation();

   useEffect(() => {
      if (open) {
         setOpen(false);
      }
   }, [pathname]);

   const navigate = useNavigate();

   return (
      <Drawer
         title={
            <div className='flex justify-center'>
               <Logo isWhite width={160} />
            </div>
         }
         onClose={() => setOpen(false)}
         open={open}
         placement='left'
         width='80%'
         bodyStyle={{
            padding: '0px 12px',
         }}
         headerStyle={{
            border: 0,
            padding: '6px 12px',
         }}
         closeIcon={null}
         getContainer='#mobile-menu'
      >
         <div className='flex flex-col h-full'>
            <div className='space-y-4'>
               <Group title={t('mutual:label.category')}>
                  <Link
                     to='/shop'
                     className={`flex items-center py-2.5 rounded-lg space-x-2 capitalize px-2 ${
                        pathname === '/shop' ? 'border bg-gray-200' : ''
                     }`}
                  >
                     <MdOutlineShoppingBag size={20} />
                     <span>{t('navbar.all')}</span>
                  </Link>
                  <NavLink
                     to='/shop/shoes'
                     className={({ isActive }) =>
                        `flex items-center py-2.5 rounded-lg space-x-2 capitalize px-2 ${
                           isActive ? 'border bg-gray-200' : ''
                        }`
                     }
                  >
                     <PiSneakerMove size={20} />
                     <span>{t('navbar.shoes')}</span>
                  </NavLink>
                  <NavLink
                     to='/shop/clothing'
                     className={({ isActive }) =>
                        `flex items-center py-2.5 rounded-lg space-x-2 capitalize px-2 ${
                           isActive ? 'border bg-gray-200' : ''
                        }`
                     }
                  >
                     <GiClothes size={20} />
                     <span>{t('navbar.clothing')}</span>
                  </NavLink>
                  <NavLink
                     to='/shop/accessories'
                     className={({ isActive }) =>
                        `flex items-center py-2.5 rounded-lg space-x-2 capitalize px-2 ${
                           isActive ? 'border bg-gray-200' : ''
                        }`
                     }
                  >
                     <FaRedhat size={20} />
                     <span>{t('navbar.accessories')}</span>
                  </NavLink>
               </Group>
               <Group title={t('personal')}>
                  <NavLink
                     to='/account/profile'
                     className={({ isActive }) =>
                        `flex items-center py-2.5 rounded-lg space-x-2 capitalize px-2 ${
                           isActive ? 'border bg-gray-200' : ''
                        }`
                     }
                  >
                     <AiOutlineProfile size={20} />
                     <span>{t('updateProfile')}</span>
                  </NavLink>
                  <NavLink
                     to='/account/my-orders'
                     className={({ isActive }) =>
                        `flex items-center py-2.5 rounded-lg space-x-2 capitalize px-2 ${
                           isActive ? 'border bg-gray-200' : ''
                        }`
                     }
                  >
                     <TfiMenuAlt size={20} />
                     <span>{t('history')}</span>
                  </NavLink>
                  <NavLink
                     to='/account/change-password'
                     className={({ isActive }) =>
                        `flex items-center py-2.5 rounded-lg space-x-2 capitalize px-2 ${
                           isActive ? 'border bg-gray-200' : ''
                        }`
                     }
                  >
                     <MdPassword size={20} />
                     <span>{t('changePass')}</span>
                  </NavLink>
               </Group>
               <Group title={t('language')}>
                  <div
                     className={`flex items-center py-2.5 rounded-lg space-x-2 capitalize px-2 ${
                        isVnLang ? 'border bg-gray-200' : ''
                     }`}
                     onClick={() => changeLng('vi')}
                  >
                     <img
                        src={images.flag.vi}
                        className='w-5 rounded-sm'
                        alt='flag'
                     />
                     <span className='text-xs'> Tiếng Việt</span>
                  </div>
                  <div
                     className={`flex items-center py-2.5 rounded-lg space-x-2 capitalize px-2 ${
                        !isVnLang ? 'border bg-gray-200' : ''
                     }`}
                     onClick={() => changeLng('en')}
                  >
                     <img
                        src={images.flag.en}
                        className='w-5 rounded-sm'
                        alt='flag'
                     />
                     <span className='text-xs'> English</span>
                  </div>
               </Group>
            </div>

            <div className='py-2 mt-auto border-t border-gray-400'>
               {!currentUser ? (
                  <div className='flex items-center justify-between'>
                     <button
                        className='flex-1 py-2 border-r border-gray-400'
                        onClick={() => {
                           navigate('/login');
                           setPreviousLocation(pathname);
                        }}
                     >
                        {t('action.login', { ns: 'mutual' })}
                     </button>
                     <button
                        className='flex-1 py-2'
                        onClick={() => {
                           navigate('/signup');
                           setPreviousLocation(pathname);
                        }}
                     >
                        {t('action.signup', { ns: 'mutual' })}
                     </button>
                  </div>
               ) : (
                  <>
                     <div className='flex items-center justify-center space-x-2'>
                        <img
                           src={currentUser.avatar?.url}
                           className='rounded-full w-9 aspect-square'
                           alt=''
                        />
                        <span className='font-semibold text-13'>
                           {currentUser.name}
                        </span>
                     </div>
                     <button
                        className='w-full py-2'
                        onClick={() => {
                           logOut();
                           deleteCart();
                        }}
                     >
                        {t('action.logOut', { ns: 'mutual' })}
                     </button>
                  </>
               )}
            </div>
         </div>
      </Drawer>
   );
};

const Group: FC<{ title: string; children: React.ReactNode }> = ({
   title,
   children,
}) => {
   return (
      <div className='mx-2 space-y-2'>
         <span className='font-semibold text-[#5B5D62] capitalize text-xs'>
            {title}
         </span>
         <div className='flex flex-col text-13'> {children}</div>
      </div>
   );
};

export default MobileMenu;
