import { ReactNode, FC, useState } from 'react';

interface Item {
   label: ReactNode | string;
}

interface MenuProps {
   open: boolean;
   title?: ReactNode | string;
   items: Item[];
   children: ReactNode | string;
}

const Menu: React.FC<MenuProps> = ({ open, title, items, children }) => {
   const [show, setShow] = useState<boolean>(open);

   return (
      show && (
         <div className='relative'>
            <div className='text-center'>{children}</div>
            {/* <div
               className='fixed top-0 right-0 h-screen w-screen bg-transparent'
               onClick={() => setShow(false)}
            />
            <div className='absolute z-20 border w-fit p-1 rounded-md text-smr'>
               <div className='px-2 pt-1 pb-2 font-medium'>{title}</div>
               <div>
                  {items.map((item, index) => (
                     <div
                        key={index}
                        className='px-2 py-[6px] rounded-md min-w-[90px] cursor-pointer hover:bg-[rgba(255,255,255,.1)] duration-100'
                        onClick={() => setShow(false)}
                     >
                        {item.label}
                     </div>
                  ))}
               </div>
            </div> */}
         </div>
      )
   );
};

export default Menu;
