import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { twMerge } from 'tailwind-merge';

import { useTranslation } from 'react-i18next';
import { BsSearch } from 'react-icons/bs';

import { Input, Logo } from '@/components';

import cartStore from '@/stores/cartStore';
import { Col, Row } from 'antd';
import { CiMenuBurger, CiShoppingCart } from 'react-icons/ci';

const Header = () => {
   const { t } = useTranslation('home');
   const { qty } = cartStore();

   const navigate = useNavigate();
   const { pathname } = useLocation();
   const isAll = pathname.includes('shop') && pathname.split('/').length === 2;

   return (
      <header
      //  className='bg-[#DFDFDF]'
      >
         <div className='container pt-4 pb-3 xl:py-6'>
            <Row align='middle' justify='space-between'>
               <Col xl={8} md={6} xs={6}>
                  <div className='xl:hidden'>
                     <CiMenuBurger size={26} />
                  </div>
                  <div className='items-center hidden text-sm space-x-6 xl:flex [&_span]:tracking-[1px] uppercase'>
                     <Link
                        to='/shop'
                        className={twMerge(
                           isAll && 'before:block item_nav_before'
                        )}
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
               </Col>
               <Col xl={8} md={12} xs={12}>
                  <Link to='/' className='flex justify-center'>
                     <Logo width={160} />
                  </Link>
               </Col>
               <Col xl={8} md={6} xs={6}>
                  <div className='flex items-center justify-end space-x-8'>
                     <div className='hidden xl:flex items-center bg-[#f5f5f5] rounded-lg xl:w-72 xl:h-10 w-64 h-8'>
                        <Input
                           className='flex-1 h-full pl-4 border-none placeholder:text-[13px]'
                           placeholder={t('placeHolder.searchHere')}
                           onKeyDown={(e) =>
                              e.key === 'Enter' &&
                              navigate(
                                 `search?q=${(
                                    e.target as HTMLInputElement
                                 ).value.trim()}`
                              )
                           }
                        />
                        <div className='flex items-center h-full px-3 border-l'>
                           <BsSearch size={14} />
                        </div>
                     </div>
                     <Link to='/cart' className='relative cursor-pointer group'>
                        <div className='duration-150 group-hover:scale-105'>
                           <CiShoppingCart size={28} />
                        </div>
                        {qty > 0 && (
                           <span className='absolute xl:w-6 w-5 aspect-square flex justify-center items-center bg-red-500 rounded-full xl:-top-3 -top-2 xl:-right-3 -right-2 text-[8px] md:text-[10px] font-semibold text-white'>
                              {qty}
                           </span>
                        )}
                     </Link>
                  </div>
               </Col>
            </Row>
         </div>
      </header>
   );
};

export default Header;
