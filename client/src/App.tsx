import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import '@/css/custom-antd.css';
import '@/css/custom-swiper.css';
import '@/css/custom-scrollbar.css';

import 'swiper/css';
import 'react-toastify/dist/ReactToastify.css';

import HomeLayout from '@/layouts/home/HomeLayout';
import AuthLayout from '@/layouts/auth/AuthLayout';
import DashboardLayout from '@/layouts/dashboard/DashboardLayout';

// HOME
import Home from '@/pages/home/Home';
import Shop from '@/pages/home/Shop';
import Cart from '@/pages/home/Cart';
import Detail from '@/pages/home/Detail';
import Chat from '@/pages/home/user/Chat';
import CheckOut from '@/pages/home/CheckOut';
import Profile from '@/pages/home/user/Profile';
import MyOrders from '@/pages/home/user/Orders';
import Account from '@/pages/home/user/Account';
import ChangePw from '@/pages/home/user/ChangePw';

//AUTH
import Login from '@/pages/auth/Login';
import SignUp from '@/pages/auth/SignUp';
import ResetPassword from '@/pages/auth/ResetPassword';
import ForgotPassword from '@/pages/auth/ForgotPassword';

//DASHBOARD
import Sizes from '@/pages/dashboard/size/Sizes';
import Overview from '@/pages/dashboard/Overview';
import Admins from '@/pages/dashboard/admin/Admins';
import Customers from '@/pages/dashboard/Customers';
import Orders from '@/pages/dashboard/order/Orders';
import Colors from '@/pages/dashboard/colors/Colors';
import Coupons from '@/pages/dashboard/voucher/Coupons';
import Variants from '@/pages/dashboard/variant/Variants';
import Products from '@/pages/dashboard/product/Products';
import Categories from '@/pages/dashboard/category/Categories';
import CreateVariant from '@/pages/dashboard/variant/CreateVariant';
import EditProduct from '@/pages/dashboard/product/edit/EditProduct';
import CreateProduct from '@/pages/dashboard/product/create/CreateProduct';

//ORDER ROUTE
import ThemeRoute from '@/route/ThemeRoute';
import PrivateRoute from '@/route/PrivateRoute';
import PrivateCheckOutRoute from '@/route/PrivateCheckOutRoute';

//PROVIDER
import AuthDashboardProvider from '@/providers/AuthDashboardProvider';

import authStore from '@/stores/authStore';

function App() {
   const { currentUser } = authStore();

   return (
      <BrowserRouter>
         <ToastContainer />
         <Routes>
            <Route element={<HomeLayout />}>
               <Route index element={<Home />} />
               <Route path='d/:slug' element={<Detail />} />
               <Route path='shop/:store?/:category?' element={<Shop />} />
               <Route path='cart' element={<Cart />} />
               <Route
                  path='checkout'
                  element={<PrivateCheckOutRoute component={CheckOut} />}
               />
               <Route path='about'></Route>
               <Route path='contact'></Route>
               <Route
                  path='account'
                  element={<PrivateRoute component={Account} />}
               >
                  <Route index element={<Navigate to='profile' />} />
                  <Route path='profile' element={<Profile />} />
                  <Route path='chat' element={<Chat />} />
                  <Route path='my-orders' element={<MyOrders />} />
                  <Route path='change-password' element={<ChangePw />} />
               </Route>
            </Route>

            <Route element={<AuthLayout />}>
               <Route path='login' element={<Login />} />
               <Route path='signup' element={<SignUp />} />
               <Route path='forgot-password' element={<ForgotPassword />} />
               <Route
                  path='reset-password/:id/:token'
                  element={<ResetPassword />}
               />
            </Route>

            <Route
               path='dashboard'
               element={
                  <AuthDashboardProvider>
                     <ThemeRoute>
                        <DashboardLayout />
                     </ThemeRoute>
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
               <Route path='chat' element={<Chat />} />
            </Route>
         </Routes>
      </BrowserRouter>
   );
}

export default App;
