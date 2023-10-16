import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import '@/css/custom-antd.css';
import '@/css/custom-swiper.css';
import '@/css/custom-scrollbar.css';
import 'swiper/css';

import 'react-modern-drawer/dist/index.css';
import 'react-toastify/dist/ReactToastify.css';
import 'react-loading-skeleton/dist/skeleton.css';

import DashboardLayout from './layouts/dashboard';
import ThemeProvider from './providers/ThemeProvider';

import Overview from './pages/dashboard/Overview';
import Products from './pages/dashboard/Products';
import Categories from './pages/dashboard/category/Categories';
import Colors from './pages/dashboard/colors/Colors';
import Customers from './pages/dashboard/Customers';
import Admins from './pages/dashboard/admin/Admins';
import Orders from './pages/dashboard/Orders';
import AuthDashboardProvider from './providers/AuthDashboardProvider';
import CreateProduct from './pages/dashboard/productManage/create/CreateProduct';
import Sizes from './pages/dashboard/size/Sizes';
import authStore from './stores/authStore';
import EditProduct from './pages/dashboard/productManage/edit/EditProduct';
import HomeLayout from './layouts/home';
import Home from './pages/home/Home';
import Shop from './pages/home/Shop';
import Detail from './pages/home/Detail';
import Cart from './pages/home/Cart';
import CheckOut from './pages/home/CheckOut';
import CreateVariant from './pages/dashboard/variantManage/CreateVariant';
import Variants from './pages/dashboard/variantManage/Variants';
import Coupons from './pages/dashboard/voucher/Coupons';

function App() {
   const { currentUser } = authStore();
   return (
      <BrowserRouter>
         <ToastContainer />
         <Routes>
            <Route path='' element={<HomeLayout />}>
               <Route index element={<Home />} />
               <Route path='d/:slug' element={<Detail />} />
               <Route path='shop/:store?/:category?' element={<Shop />} />

               <Route path='cart' element={<Cart />} />
               <Route path='checkout' element={<CheckOut />} />

               <Route path='about'></Route>
               <Route path='contact'></Route>

               <Route path='user'>
                  <Route index />
                  <Route path='account' />
                  <Route path='account/profile' />
                  <Route path='account/change-password' />
                  <Route path='order' />
               </Route>
            </Route>

            <Route
               path='dashboard'
               element={
                  <AuthDashboardProvider>
                     <ThemeProvider>
                        <DashboardLayout />
                     </ThemeProvider>
                  </AuthDashboardProvider>
               }
            >
               <Route index element={<Overview />} />
               <Route path='products' element={<Products />} />
               <Route path='products/:slug/edit' element={<EditProduct />} />
               <Route
                  path='products/:slug/variants/create'
                  element={<CreateVariant />}
               />
               <Route path='products/:slug/variants' element={<Variants />} />

               <Route path='products/create' element={<CreateProduct />} />
               <Route path='categories' element={<Categories />} />
               <Route path='colors' element={<Colors />} />
               <Route path='sizes' element={<Sizes />} />
               <Route path='customers' element={<Customers />} />
               {currentUser && currentUser.role === 'root' && (
                  <Route path='admins' element={<Admins />} />
               )}
               <Route path='orders' element={<Orders />} />
               <Route path='coupons' element={<Coupons />} />
            </Route>
         </Routes>
      </BrowserRouter>
   );
}

export default App;
