import { useTranslation } from 'react-i18next';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { twMerge } from 'tailwind-merge';

const Navbar = () => {
   const { t } = useTranslation('home');
   const { pathname } = useLocation();
   const isAll = pathname.includes('shop') && pathname.split('/').length === 2;

   return (
      <div className='items-center hidden text-sm space-x-6 xl:flex [&_span]:tracking-[1px] uppercase'>
         <Link
            to='/shop'
            className={twMerge(isAll && 'before:block item_nav_before')}
         >
            <span className='duration-150 hover:opacity-75 spacing'>
               {t('navbar.all')}
            </span>
         </Link>
         <NavLink
            to='/shop/shoes'
            className={({ isActive }) =>
               isActive ? 'before:block item_nav_before' : ''
            }
         >
            <span className='duration-150 hover:opacity-75'>
               {t('navbar.shoes')}
            </span>
         </NavLink>
         <NavLink
            to='/shop/clothing'
            className={({ isActive }) =>
               isActive ? 'before:block item_nav_before' : ''
            }
         >
            <span className='duration-150 hover:opacity-75'>
               {t('navbar.clothing')}
            </span>
         </NavLink>
         <NavLink
            to='/shop/accessories'
            className={({ isActive }) =>
               isActive ? 'before:block item_nav_before' : ''
            }
         >
            <span className='duration-150 hover:opacity-75'>
               {t('navbar.accessories')}
            </span>
         </NavLink>
      </div>
   );
};

export default Navbar;
