import authStore from '@/stores/authStore';
import { FC, ReactNode } from 'react';
import images from '@/assets/images';
import LoginForm from '@/pages/dashboard/auth/LoginForm';

interface AuthDashboardProviderProps {
   children: ReactNode;
}

const AuthDashboardProvider: FC<AuthDashboardProviderProps> = ({
   children,
}) => {
   const { isLogin } = authStore();

   if (isLogin) return children;

   return (
      <div
         className='w-screen h-screen bg-top bg-no-repeat bg-cover'
         style={{ backgroundImage: `url(${images.auth_db})` }}
      >
         <div className='flex items-center justify-center h-full'>
            <div className='w-[30%] h-[60%] flex flex-col p-8 bg-[#f1f1f1] rounded-lg space-y-5'>
               <h2 className='text-3xl font-bold text-center text-zinc-700'>
                  Admin login
               </h2>
               <div className='flex-1 px-4'>
                  <LoginForm />
               </div>
            </div>
         </div>
      </div>
   );
};

export default AuthDashboardProvider;
