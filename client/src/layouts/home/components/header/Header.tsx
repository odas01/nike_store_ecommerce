import { Col, Row } from 'antd';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';

import { BsSearch } from 'react-icons/bs';
import { RiMenu2Line } from 'react-icons/ri';
import { CiShoppingCart } from 'react-icons/ci';

import Navbar from './Navbar';
import { Input, Logo } from '@/components';

import cartStore from '@/stores/cartStore';
import { useState } from 'react';
import MobileMenu from './MobileMenu';

const Header = () => {
   const [openDrawer, setOpenDrawer] = useState<boolean>(false);

   const { t } = useTranslation('home');
   const { qty } = cartStore();

   const navigate = useNavigate();

   return (
      <div className='bg-[#dfdfdf]'>
         <header className='container py-3 mobile:px-2 xl:py-6'>
            <Row align='middle' justify='space-between'>
               <Col xl={8} md={6} xs={6}>
                  <div className='p-1 xl:hidden w-fit'>
                     <div onClick={() => setOpenDrawer(true)}>
                        <RiMenu2Line size={26} className='mobile:hidden' />
                        <RiMenu2Line size={20} className='md:hidden' />
                     </div>
                     <div className='xl:hidden' id='mobile-menu'>
                        <MobileMenu open={openDrawer} setOpen={setOpenDrawer} />
                     </div>
                  </div>
                  <Navbar />
               </Col>
               <Col xl={8} md={12} xs={12}>
                  <Link to='/' className='flex justify-center'>
                     <Logo width={160} />
                  </Link>
               </Col>
               <Col xl={8} md={6} xs={6}>
                  <div className='flex items-center justify-end pr-3 space-x-8 md:pr-0'>
                     <div className='hidden xl:flex items-center bg-[#f5f5f5] rounded-lg w-72 h-8'>
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
                           <span className='absolute xl:w-6 w-5 aspect-square flex-center bg-red-500 rounded-full xl:-top-3 -top-2 xl:-right-3 -right-2 text-[8px] md:text-[10px] font-semibold text-white'>
                              {qty}
                           </span>
                        )}
                     </Link>
                  </div>
               </Col>
            </Row>
         </header>
      </div>
   );
};

export default Header;
