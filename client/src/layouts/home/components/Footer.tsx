import { Col, Row } from 'antd';
import React from 'react';

const Footer = () => {
   return (
      <>
         <div className='bg-red-500 banner !h-[30vh] text-white'>
            {/* <div className='container mx-auto 2xl:max-w-[1340px] border py-4'>
               <Row>
                  <Col span={6}>
                     <h2 className='mb-4 text-base font-medium'>Company</h2>
                     <div className='flex flex-col space-y-1'>
                        <span>About us</span>
                        <span>Press</span>
                        <span>Contact</span>
                     </div>
                  </Col>
                  <Col span={6}>
                     <h2>Introduce</h2>
                     <div className='flex flex-col space-y-1'>
                        <span>0123789456</span>
                        <span>lntthanh3317@gmail.com</span>
                        <span>
                           Đường 3/2, phường Xuân Khánh, quận Ninh Kiều, thành
                           phố Cần Thơ
                        </span>
                     </div>
                  </Col>
                  <Col span={6}>
                     <h2>Company</h2>
                     <div className='flex flex-col space-y-1'>
                        <span>About us</span>
                        <span>Press</span>
                        <span>Contact</span>
                     </div>
                  </Col>
               </Row>
            </div> */}
         </div>
         <div className='bg-[#0f0f0f] text-white'>
            <div className='container mx-auto 2xl:max-w-[1340px] text-xs py-1'>
               © Copyright 2023 By lntthanh3317
            </div>
         </div>
      </>
   );
};

export default Footer;
