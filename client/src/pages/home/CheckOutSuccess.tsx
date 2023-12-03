import { useNavigate } from 'react-router-dom';
import ReactConfetti from 'react-confetti';

import { BsCheck2Circle } from 'react-icons/bs';

import { PageTitle } from '@/components';

import cartStore from '@/stores/cartStore';
import orderSuccessStore from '@/stores/orderSuccessStore';

const CheckOutSuccess = () => {
   const navigate = useNavigate();

   const { deleteCart } = cartStore();
   const { setSuccess } = orderSuccessStore();

   const onNavigate = (path: string) => {
      console.log(123);

      deleteCart();
      navigate(path);
      setSuccess(false);
   };

   return (
      <>
         <PageTitle title='Check out success' />
         <div className='flex flex-col items-center pt-[10%] h-screen'>
            <ReactConfetti
               width={window.innerWidth - 10}
               height={window.innerHeight}
               run={true}
            />
            <BsCheck2Circle size={80} color='#10B981' />
            <span className='mt-2 text-2xl font-medium'>
               Đặt hàng thành công
            </span>
            <div className='flex items-center mt-6 space-x-7'>
               <p
                  className='px-4 py-2 border rounded-full cursor-pointer hover:bg-[rgba(0,0,0,0.05)] duration-150'
                  onClick={() => onNavigate('/account/my-orders')}
               >
                  Xem lại đơn hàng
               </p>
               <p
                  className='px-4 py-2 border rounded-full cursor-pointer hover:bg-[rgba(0,0,0,0.05)] duration-150'
                  onClick={() => onNavigate('/')}
               >
                  Về trang chủ
               </p>
            </div>
         </div>
      </>
   );
};

export default CheckOutSuccess;
