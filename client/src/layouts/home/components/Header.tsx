import { Input, Logo } from '@/components';
import cartStore from '@/stores/cartStore';
import { useTranslation } from 'react-i18next';
import { BsBell, BsSearch } from 'react-icons/bs';
import { RiShoppingCartLine } from 'react-icons/ri';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
   const { t } = useTranslation('home');
   const { qty } = cartStore();

   const navigate = useNavigate();
   return (
      <div className='container'>
         <div className='flex items-center justify-between h-20'>
            <Link to='/'>
               <Logo width={120} />
            </Link>

            <div className='flex items-center justify-center space-x-8'>
               <Link to='/'>
                  <span>{t('navbar.home')}</span>
               </Link>
               <Link to='/shop'>
                  <span>Shop</span>
               </Link>
               <Link to='/'>
                  <span>{t('navbar.about')}</span>
               </Link>
               <Link to='/'>
                  <span>{t('navbar.contact')}</span>
               </Link>
            </div>
            <div className='flex items-center'>
               <div className='flex items-center border border-gray-300 rounded-full w-72 h-9'>
                  <Input
                     className='flex-1 h-full pl-4 border-none placeholder:text-[13px]'
                     placeholder={t('placeHolder.searchHere')}
                     onKeyDown={(e) =>
                        e.key === 'Enter' &&
                        navigate(
                           `shop?q=${(
                              e.target as HTMLInputElement
                           ).value.trim()}`
                        )
                     }
                  />
                  <div className='flex items-center h-full px-3 border-l'>
                     <BsSearch size={14} />
                  </div>
               </div>
               <div className='flex items-center ml-16 space-x-8 '>
                  {/* <div className='relative cursor-pointer group'>
                     <div className='duration-150 group-hover:scale-105'>
                        <BsBell size={26} />
                     </div>
                     <span className='absolute w-6 aspect-square flex justify-center items-center bg-red-500 rounded-full -top-3 -right-3 text-[10px] font-semibold text-white'>
                        9+
                     </span>
                  </div> */}
                  <Link to='/cart' className='relative cursor-pointer group'>
                     <div className='duration-150 group-hover:scale-105'>
                        <RiShoppingCartLine size={26} />
                     </div>
                     {qty > 0 && (
                        <span className='absolute w-6 aspect-square flex justify-center items-center bg-red-500 rounded-full -top-3 -right-3 text-[10px] font-semibold text-white'>
                           {qty}
                        </span>
                     )}
                  </Link>
               </div>
            </div>
         </div>
      </div>
   );
};

export default Header;
