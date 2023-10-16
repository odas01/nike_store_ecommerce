import TopHeader from './components/TopHeader';
import Header from './components/Header';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { BsArrowRight } from 'react-icons/bs';
import images from '@/assets/images';
import Footer from './components/Footer';
import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { cartApi } from '@/api';
import cartStore from '@/stores/cartStore';

const HomeLayout = () => {
   const { pathname } = useLocation();
   const { getCart } = cartStore();

   useEffect(() => {
      getCart();
   }, []);

   // useEffect(() => {
   //    window.scrollTo({
   //       top: 0,
   //       behavior: 'instant',
   //    });
   // }, [pathname]);
   return (
      <div className='flex flex-col min-h-screen'>
         <TopHeader />
         <Header />
         <div className='min-h-[80vh] pb-6 py-5'>
            <Outlet />
         </div>
         <div className='mt-auto'>
            <Footer />
         </div>
      </div>
   );
};

export default HomeLayout;
