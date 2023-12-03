import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';

import Header from './components/Header';
import Footer from './components/Footer';
import TopHeader from './components/TopHeader';

import cartStore from '@/stores/cartStore';

import DiaflowBot from './components/DiaflowBot';

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
      <div className='flex flex-col min-h-screen'>
         <TopHeader />
         <Header />
         <main className='min-h-[80vh] pb-20 flex flex-col'>
            <Outlet />
         </main>

         <Footer />
      </div>
   );
};

export default HomeLayout;
