import { AiOutlineClose } from 'react-icons/ai';

import { Button } from '@/components';

interface ModalProps {
   title?: React.ReactNode | string;
   open: boolean;
   onOk: () => void;
   onCancel: () => void;
   showButton?: boolean;
   children?: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({
   title,
   open,
   onOk,
   showButton = true,
   onCancel,
   children,
}) => {
   return (
      <div id='dropdown'>
         {open && (
            <div
               className='fixed top-0 right-0 h-screen w-screen bg-[rgba(0,0,0,0.5)] z-[1000]'
               onClick={onCancel}
            />
         )}
         <div
            className={`fixed right-1/2 translate-x-1/2 w-[30%] duration-200 z-[1000] ${
               open
                  ? 'top-[15%] opacity-100 visible'
                  : 'top-1/3 opacity-0 invisible'
            }`}
            // ref={dropdownRef}
         >
            <div className='py-4 px-6 space-y-4 w-full rounded-lg bg-white dark:bg-[#1A1C23] text-black dark:text-white shadow-lg'>
               {title && (
                  <div className='flex items-center justify-between font-medium'>
                     <div>{title}</div>
                     <div onClick={onCancel}>
                        <AiOutlineClose />
                     </div>
                  </div>
               )}
               <div className='break-words'>{children}</div>
               {showButton && (
                  <div className='flex items-center justify-end space-x-1'>
                     <Button
                        onClick={onCancel}
                        className='bg-transparent border border-gray-500'
                     >
                        Cancel
                     </Button>
                     <Button onClick={onOk}>Ok</Button>
                  </div>
               )}
            </div>
         </div>
      </div>
   );
};

export default Modal;
