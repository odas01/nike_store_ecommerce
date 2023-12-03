import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { AiOutlineRollback } from 'react-icons/ai';

import Menu from './Menu';

import authStore from '@/stores/authStore';

function Aside() {
   const { logOut } = authStore();
   const navigate = useNavigate();
   const { t } = useTranslation(['dashboard', 'mutual']);

   const handleLogout = () => {
      logOut();
      navigate('/dashboard');
   };

   return (
      <div
         className='flex flex-col h-full p-5
      space-y-8 text-[#393939] bg-[#FAFAFA] dark:text-[rgb(157,157,157)]  dark:bg-[#1A1C23]'
      >
         <h2 className='p-2 text-lg'>DASHBOARD</h2>
         <div className='flex-1 overflow-y-auto'>
            <Menu />
         </div>
         <div
            className='flex items-center mt-auto px-3 pt-6 w-full border-t border-[rgb(194,194,194)] space-x-4 font-normal cursor-pointer duration-150 dark:hover:text-white'
            onClick={handleLogout}
         >
            <AiOutlineRollback />
            <span>{t('action.logOut', { ns: 'mutual' })}</span>
         </div>
      </div>
   );
}

export default Aside;
