import React from 'react';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';

type Props = {
   children?: React.ReactNode;
};

const LoadingOverlay: React.FC<Props> = ({ children }) => {
   return (
      <div className='h-[100vh] bg-[rgba(0,0,0,0.5)] fixed z-50 inset-0 flex justify-center items-center'>
         {children}
      </div>
   );
};

export default LoadingOverlay;
