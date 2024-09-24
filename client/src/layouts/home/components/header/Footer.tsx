import { Col, Row } from 'antd';

import { MdOutlinePlace } from 'react-icons/md';
import { AiOutlineMail, AiOutlinePhone } from 'react-icons/ai';

import { useTranslation } from 'react-i18next';
import images from '@/assets/images';

const Footer = () => {
   const { t } = useTranslation('home');
   return (
      <footer className='bg-[#f1f1f1] mt-auto'>
         <div className='container px-2 py-2'>
            <div className='mt-4 mb-10'>
               <Row gutter={[24, 12]}>
                  <Col xl={6} md={0}>
                     <h2 className='text-lg font-medium'>Follow our Socials</h2>
                     <div className='flex pt-4'>
                        <div
                           className='w-10 h-10 shadow-[0px_2px_12px_0px_#006fff87] rounded-full flex-center transition-all 
                              duration-300 cursor-pointer hover:bg-[rgba(0,0,0,0.8)] hover:-translate-y-1'
                        >
                           <img
                              className='w-4 h-4'
                              src={images.social.facebook}
                              alt='facebook'
                           />
                        </div>
                        <div
                           className='w-10 h-10 shadow-[0px_2px_12px_0px_#006fff87] rounded-full flex-center ml-4 transition-all 
                              duration-300 cursor-pointer hover:bg-[rgba(0,0,0,0.8)] hover:-translate-y-1'
                        >
                           <img
                              className='w-4 h-4'
                              src={images.social.instagram}
                              alt='instagram'
                           />
                        </div>
                        <div
                           className='w-10 h-10 shadow-[0px_2px_12px_0px_#006fff87] rounded-full flex-center ml-4 transition-all 
                              duration-300 cursor-pointer hover:bg-[rgba(0,0,0,0.8)] hover:-translate-y-1'
                        >
                           <img
                              className='w-4 h-4'
                              src={images.social.google}
                              alt='google'
                           />
                        </div>
                     </div>
                  </Col>
                  <Col xl={6} md={8}>
                     <h2 className='text-lg font-medium'>{t('company')}</h2>
                     <div className='pt-2 space-y-1 font-normal'>
                        <p>{t('abus')}</p>
                        <p>{t('contact')}</p>
                     </div>
                  </Col>
                  <Col xl={6} md={8}>
                     <h2 className='text-lg font-medium'>{t('introduce')}</h2>
                     <div className='pt-2 pr-6 space-y-1 font-normal'>
                        <p className='flex items-center '>
                           <AiOutlinePhone className='mr-2' /> 0123789456
                        </p>
                        <p className='flex items-center '>
                           <AiOutlineMail className='mr-2' />{' '}
                           lntthanh3317@gmail.com
                        </p>
                        <p className='flex '>
                           <MdOutlinePlace className='mr-2 relative top-[2px]' />
                           Đường 3/2, phường Xuân Khánh,
                           <br /> quận Ninh Kiều, thành phố Cần Thơ
                        </p>
                     </div>
                  </Col>
                  <Col xl={6} md={8}>
                     <h2 className='text-lg font-medium'>{t('support')}</h2>
                     <div className='pt-2 space-y-1 font-normal'>
                        <p>{t('abc')}</p>
                        <p>{t('abc1')}</p>
                        <p>
                           {t('abc2')}:{' '}
                           <span className='text-gray-800 '>
                              lntthanh3317@gmail.com
                           </span>
                        </p>
                     </div>
                  </Col>
               </Row>
            </div>
            <span className='pt-2 text-xs border-t border-gray-500'>
               © Copyright 2023 By lntthanh3317
            </span>
         </div>
      </footer>
   );
};

export default Footer;
