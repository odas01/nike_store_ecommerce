import { FC, ReactNode, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CgSize } from 'react-icons/cg';
import { FiUsers } from 'react-icons/fi';
import { GiSonicShoes } from 'react-icons/gi';
import { BiCategoryAlt } from 'react-icons/bi';
import { RxDropdownMenu } from 'react-icons/rx';
import { LuLayoutDashboard } from 'react-icons/lu';
import { IoColorPaletteOutline } from 'react-icons/io5';
import { RiAdminLine, RiCoupon3Line } from 'react-icons/ri';
import { BsCartCheck, BsChevronDown, BsChevronRight } from 'react-icons/bs';
import authStore from '@/stores/authStore';
import { useTranslation } from 'react-i18next';

function Menu() {
   const { currentUser } = authStore();
   const { t } = useTranslation('dashboard', { keyPrefix: 'aside' });
   return (
      <div className='flex flex-col space-y-2 text-sm font-medium'>
         <MenuItem title={t('overview')} path='' icon={<LuLayoutDashboard />} />

         <MenuItem title={t('list')} path='products' icon={<GiSonicShoes />} />
         <MenuItem
            title={t('color')}
            path='colors'
            icon={<IoColorPaletteOutline />}
         />
         <MenuItem
            title={t('size')}
            path='sizes'
            icon={<IoColorPaletteOutline />}
         />

         <MenuItem
            title={t('category')}
            path='categories'
            icon={<BiCategoryAlt />}
         />
         <MenuItem title={t('customer')} path='customers' icon={<FiUsers />} />
         {currentUser && currentUser.role === 'root' && (
            <MenuItem title={t('admin')} path='admins' icon={<RiAdminLine />} />
         )}
         <MenuItem title='Orders' path='orders' icon={<BsCartCheck />} />
         <MenuItem title='Coupon' path='coupons' icon={<BsCartCheck />} />
         {/* <MenuItem title='Coupons' path='coupons' icon={<RiCoupon3Line />} /> */}
      </div>
   );
}

interface MenuItemProps {
   title: string;
   path: string | '';
   icon: ReactNode;
}

const MenuItem: FC<MenuItemProps> = ({ title, path, icon }) => {
   const { pathname } = useLocation();
   const curPath = pathname.replace('dashboard', '').split('/').join('');

   return (
      <Link
         to={path}
         className={`flex items-center space-x-2 p-3 rounded-md cursor-pointer hover:text-white hover:bg-green-500 duration-100 dark:hover:text-white dark:hover:bg-[#1A1C20] ${
            curPath === path
               ? 'text-white bg-green-500  dark:text-white dark:bg-[#1A1C20]'
               : ''
         }`}
      >
         {icon}
         <span>{title}</span>
      </Link>
   );
};

interface MenuItemHasChildProps {
   title: string;
   icon: ReactNode;
   children?: ReactNode;
}
const MenuItemHasChild: FC<MenuItemHasChildProps> = ({
   title,
   icon,
   children,
}) => {
   const [show, setShow] = useState<boolean>(false);
   return (
      <div className='flex flex-col'>
         <div
            className='flex items-center p-3 duration-200 rounded-md cursor-pointer'
            onClick={() => setShow(!show)}
         >
            <span>{title}</span>
            <div className='ml-auto scale-75'>
               {!show ? <BsChevronDown /> : <BsChevronRight />}
            </div>
         </div>
         {show && <div className='pl-8 space-y-2 text-xs'>{children}</div>}
      </div>
   );
};

export default Menu;
