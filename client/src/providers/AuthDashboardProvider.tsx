import LoginForm from '@/pages/dashboard/auth/LoginForm';

import authStore from '@/stores/authStore';
import images from '@/assets/images';

interface AuthDashboardProviderProps {
   children: React.ReactNode;
}

const AuthDashboardProvider: React.FC<AuthDashboardProviderProps> = ({
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
