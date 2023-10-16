import images from '@/assets/images';
import { Button, Dropdown, Error, Input } from '@/components';
import authStore from '@/stores/authStore';
import { useTranslation } from 'react-i18next';
import { TfiWorld } from 'react-icons/tfi';
import { FiChevronDown, FiUser } from 'react-icons/fi';
import { BiLogIn } from 'react-icons/bi';
import { useState } from 'react';
import { Modal } from 'antd';
import { BsGoogle } from 'react-icons/bs';
import AuthForm from './auth';

const TopHeader = () => {
   const [open, setOpen] = useState<boolean>(true);

   const { t, i18n } = useTranslation(['dashboard', 'home']);
   const { currentUser, logOut } = authStore();

   const changeLng = (lng: 'vi' | 'en') => {
      i18n.changeLanguage(lng);
   };
   const lng = i18n.language === 'vi' ? 'Tiếng việt' : 'English';

   return (
      <div className='text-[13px] bg-[#E5E7EB]'>
         <div className='container'>
            <div className='flex items-center justify-end space-x-5 h-9'>
               <Dropdown
                  arrow={true}
                  border={false}
                  placement='bottomRight'
                  trigger={['click']}
                  items={[
                     {
                        label: (
                           <div
                              className='flex items-center pr-5 py-0.5 pl-0.5 space-x-2 cursor-pointer'
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
                              className='flex items-center pr-5 py-0.5 pl-0.5 space-x-2 cursor-pointer'
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
                  <div className='flex items-center space-x-1 cursor-pointer'>
                     <TfiWorld size={16} />
                     <span>{lng}</span>
                     <FiChevronDown size={16} />
                  </div>
               </Dropdown>
               {currentUser ? (
                  <Dropdown
                     arrow={true}
                     border={false}
                     trigger={['click']}
                     placement='bottomRight'
                     items={[
                        {
                           label: (
                              <span
                                 className='px-2 space-x-2 text-sm cursor-pointer'
                                 onClick={() => {
                                    console.log('to my account');
                                 }}
                              >
                                 {t('myAccount', { ns: 'home' })}
                              </span>
                           ),
                        },
                        {
                           label: (
                              <span
                                 className='px-2 space-x-2 text-sm cursor-pointer'
                                 onClick={() => {
                                    console.log('to my orders');
                                 }}
                              >
                                 {t('orders', { ns: 'home' })}
                              </span>
                           ),
                        },
                        {
                           label: (
                              <span
                                 className='px-2 space-x-2 text-sm cursor-pointer'
                                 onClick={() => logOut()}
                              >
                                 {t('action.logOut')}
                              </span>
                           ),
                        },
                     ]}
                  >
                     <div className='flex items-center space-x-2'>
                        {currentUser.avatar ? (
                           <img
                              src={currentUser.avatar.url}
                              alt=''
                              className='w-6 rounded-full aspect-square'
                           />
                        ) : (
                           <FiUser size={18} />
                        )}
                        <span className='max-w-[150px] line-clamp-1'>
                           Hi, {currentUser.name}
                        </span>
                     </div>
                  </Dropdown>
               ) : (
                  <>
                     <div
                        className='flex items-center space-x-1 cursor-pointer'
                        onClick={() => setOpen(true)}
                     >
                        <BiLogIn size={18} />
                        <span>{t('action.login')}</span>
                     </div>
                     <Modal
                        centered
                        open={open}
                        footer={null}
                        onCancel={() => setOpen(false)}
                        className='bg-white rounded'
                     >
                        <AuthForm />
                     </Modal>
                  </>
               )}
            </div>
         </div>
      </div>
   );
};

// const AuthMainForm = () => {

// };

export default TopHeader;
