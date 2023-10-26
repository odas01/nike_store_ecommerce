import images from '@/assets/images';
import { Col, Row } from 'antd';
import React from 'react';
import { AiOutlineMail, AiOutlinePhone } from 'react-icons/ai';
import { MdOutlinePlace } from 'react-icons/md';

const Footer = () => {
   return (
      <div className='border-t border-[#e7e7e7] mt-auto'>
         <div className='container pt-4 pb-2'>
            <div className='mt-4 mb-10'>
               <Row gutter={24}>
                  <Col span={6}>
                     <h2 className='text-lg'>Follow our Socials</h2>
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
                  <Col span={6}>
                     <h2 className='text-lg'>Company</h2>
                     <div className='pt-2 font-normal space-y-1'>
                        <p>About Us</p>
                        <p>Press</p>
                        <p>Contact</p>
                     </div>
                  </Col>
                  <Col span={6}>
                     <h2 className='text-lg'>Introduce</h2>
                     <div className='pt-2 pr-6 font-normal space-y-1'>
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
                  <Col span={6}>
                     <h2 className='text-lg'>Support</h2>
                     <div className='pt-2 font-normal space-y-1'>
                        <p>Submit a warranty claim</p>
                        <p>Submit a return request</p>
                        <p>
                           Customer support:{' '}
                           <span className='text-gray-800 '>
                              lntthanh3317@gmail.com
                           </span>
                        </p>
                     </div>
                  </Col>
               </Row>
            </div>
            <span className='pt-2 text-xs border-t border-gray-500'>
               © Copyright 2022 By lntthanh3317
            </span>
         </div>
      </div>
   );
};

export default Footer;
