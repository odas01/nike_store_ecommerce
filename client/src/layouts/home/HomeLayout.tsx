import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';

import Header from './components/header/Header';
import Footer from './components/header/Footer';
import TopHeader from './components/header/TopHeader';

import cartStore from '@/stores/cartStore';

const HomeLayout = () => {
   const { pathname } = useLocation();
   const { getCart } = cartStore();

   useEffect(() => {
      getCart();
   }, []);

   useEffect(() => {
      if (!pathname.includes('shop')) {
         window.scrollTo({
            top: 0,
            behavior: 'instant',
         });
      }
   }, [pathname]);

   return (
      <div className='flex flex-col min-h-screen overflow-hidden'>
         <TopHeader />
         <Header />
         <main className='min-h-[80vh] xl:pb-20 md:pb-12 pb-8 xl:pt-0 md:pt-4 flex flex-col container'>
            <Outlet />
         </main>

         <Footer />
      </div>
   );
};

export default HomeLayout;
