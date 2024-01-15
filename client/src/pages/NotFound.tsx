import { useNavigate } from 'react-router-dom';

import { Dropdown, PageTitle } from '@/components';

import authStore from '@/stores/authStore';
import images from '@/assets/images';
import { TfiWorld } from 'react-icons/tfi';
import { useTranslation } from 'react-i18next';

function Notfound() {
   const navigate = useNavigate();
   const { t, i18n } = useTranslation(['mutual']);
   const changeLng = (lng: 'vi' | 'en') => {
      i18n.changeLanguage(lng);
   };

   const { currentUser } = authStore();

   return (
      <main className='h-screen w-full flex flex-col justify-center items-center bg-[#1A2238]'>
         <PageTitle title='Not found' />
         <div className='fixed h-8 top-4 left-4 w-36'>
            <img src={images.auth_logo} alt='logo' />
         </div>
         <div className='fixed space-y-3 right-4 top-4'>
            <Dropdown
               arrow={true}
               border={false}
               placement='bottomRight'
               trigger={['click']}
               items={[
                  {
                     label: (
                        <div
                           className='flex items-center px-3 py-2 space-x-2 cursor-pointer'
                           onClick={() => changeLng('vi')}
                        >
                           <img
                              src={images.flag.vi}
                              className='w-5 rounded-sm'
                              alt='flag'
                           />
                           <span className='text-xs'> Tiếng Việt</span>
                        </div>
                     ),
                  },
                  {
                     label: (
                        <div
                           className='flex items-center px-3 py-2 space-x-2 cursor-pointer'
                           onClick={() => changeLng('en')}
                        >
                           <img
                              src={images.flag.en}
                              className='w-5 rounded-sm'
                              alt='flag'
                           />
                           <span className='text-xs'>English</span>
                        </div>
                     ),
                  },
               ]}
            >
               <div className='px-4 cursor-pointer'>
                  <TfiWorld size={14} color='#fff' />
               </div>
            </Dropdown>
         </div>
         <h1 className='font-extrabold tracking-widest text-white text-9xl'>
            404
         </h1>
         <div className='bg-[#FF6A3D] px-2 text-sm rounded rotate-12 absolute'>
            {t('notfound.pageNotFound')}
         </div>
         <div className='flex gap-4'>
            <button className='mt-5'>
               <div
                  className='relative inline-block text-sm font-medium text-[#FF6A3D] group active:text-orange-500 focus:outline-none focus:ring'
                  onClick={() =>
                     navigate(
                        currentUser?.role === 'customer' ? '/' : '/dashboard'
                     )
                  }
               >
                  <span className='absolute inset-0 transition-transform translate-x-0.5 translate-y-0.5 bg-[#FF6A3D] group-hover:translate-y-0 group-hover:translate-x-0'></span>

                  <span className='relative block px-8 py-3 bg-[#1A2238] border border-current'>
                     {t('notfound.goHome')}
                  </span>
               </div>
            </button>
            <button className='mt-5'>
               <div
                  className='relative inline-block text-sm font-medium text-[#FF6A3D] group active:text-orange-500 focus:outline-none focus:ring'
                  onClick={() => navigate(-2)}
               >
                  <span className='absolute inset-0 transition-transform translate-x-0.5 translate-y-0.5 bg-[#FF6A3D] group-hover:translate-y-0 group-hover:translate-x-0'></span>

                  <span className='relative block px-8 py-3 bg-[#1A2238] border border-current'>
                     {t('notfound.previousPage')}
                  </span>
               </div>
            </button>
         </div>
      </main>
   );
}

export default Notfound;
