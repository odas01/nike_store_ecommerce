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
import Detail from '@/pages/home/ProductDetail';
import Search from '@/pages/home/Search';
import CheckOut from '@/pages/home/CheckOut';
import Profile from '@/pages/home/user/Profile';
import MyOrders from '@/pages/home/user/Orders';
import Account from '@/pages/home/user/Account';
import ChangePw from '@/pages/home/user/ChangePw';
import OrderDetail from './pages/home/user/OrderDetail';
import CheckOutSuccess from '@/pages/home/CheckOutSuccess';

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
import ProfileAdmin from './pages/dashboard/profile/Profile';
import Coupons from '@/pages/dashboard/voucher/Coupons';
import Variants from '@/pages/dashboard/variant/Variants';
import Products from '@/pages/dashboard/product/Products';
import Categories from '@/pages/dashboard/category/Categories';
import CreateVariant from '@/pages/dashboard/variant/CreateVariant';
import EditProduct from '@/pages/dashboard/product/edit/EditProduct';
import CreateProduct from '@/pages/dashboard/product/create/CreateProduct';

import Notfound from '@/pages/NotFound';

//ORDER ROUTE
import ThemeRoute from '@/route/ThemeRoute';
import PrivateRoute from '@/route/PrivateRoute';
import PrivateCheckOutRoute from '@/route/PrivateCheckOutRoute';

//PROVIDER
import AuthDashboardProvider from '@/providers/AuthDashboardProvider';

import authStore from '@/stores/authStore';
// import orderSuccessStore from '@/stores/orderSuccessStore';

function App() {
   const { currentUser } = authStore();
   // const { success } = orderSuccessStore();

   return (
      <BrowserRouter>
         <ToastContainer />
         <Routes>
            {true && (
               <Route path='checkout/success' element={<CheckOutSuccess />} />
            )}
            <Route element={<HomeLayout />}>
               <Route index element={<Home />} />
               <Route path='d/:slug' element={<Detail />} />
               <Route path='shop/:store?/:category?' element={<Shop />} />
               <Route path='search' element={<Search />} />
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
                  <Route path='my-orders' element={<MyOrders />} />
                  <Route path='my-orders/:orderId' element={<OrderDetail />} />
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
               {/* <Route path='orders' element={<Orders />} /> */}
               <Route
                  path='orders/pending'
                  element={<Orders status='pending' />}
               />
               <Route
                  path='orders/processing'
                  element={<Orders status='processing' />}
               />
               <Route
                  path='orders/delivered'
                  element={<Orders status='delivered' />}
               />
               <Route
                  path='orders/cancel'
                  element={<Orders status='cancel' />}
               />
               <Route path='coupons' element={<Coupons />} />
               <Route path='profile/:id' element={<ProfileAdmin />} />
            </Route>

            <Route path='*' element={<Navigate to='404' />} />
            <Route path='404' element={<Notfound />} />
         </Routes>
      </BrowserRouter>
   );
}

export default App;
