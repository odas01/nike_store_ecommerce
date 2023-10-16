import { Dropdown as DropdownAntd } from 'antd';
import { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

interface ItemType {
   label: string | ReactNode;
}

interface DropDownProps {
   items: ItemType[];
   placement?:
      | 'topLeft'
      | 'topCenter'
      | 'topRight'
      | 'bottomLeft'
      | 'bottomCenter'
      | 'bottomRight'
      | 'top'
      | 'bottom';
   trigger?: ('click' | 'hover' | 'contextMenu')[];
   type?: string;
   border?: boolean;
   arrow?: boolean;
   className?: string;
   children: string | React.ReactNode;
}

const Dropdown: React.FC<DropDownProps> = ({
   items,
   placement,
   border = true,
   arrow = false,
   trigger = ['click'],
   children,
}) => {
   return (
      <DropdownAntd
         {...{ trigger, placement, arrow }}
         menu={{
            items: items.map((item, index) => ({
               key: index,
               label: (
                  <div key={index} className='dark:!text-white p-1 text-[13px]'>
                     {item.label}
                  </div>
               ),
            })),
            className: twMerge(
               'dark:!bg-[#1A1C23] max-h-[250px] overflow-y-scroll scrollbar-hide !rounded-md [&>li:hover]:!bg-[rgba(0,0,0,0.06)] dark:[&>li:hover]:!bg-[rgba(255,255,255,0.1)] [&>li]:!p-0',
               border && 'border border-gray-400 dark:border-[#3f4244]'
            ),
         }}
      >
         <div className='cursor-pointer'>{children}</div>
      </DropdownAntd>
   );
};

export default Dropdown;
