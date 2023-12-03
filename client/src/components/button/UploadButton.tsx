import { useRef } from 'react';
import { twMerge } from 'tailwind-merge';

import { LuImagePlus } from 'react-icons/lu';

import { fileToBase64 } from '@/helpers';
import { Image } from '@/types';

interface UploadButtonProps {
   multiple?: boolean;
   setValue: (data: Image[]) => void;
   className?: string;
}

const UploadButton: React.FC<UploadButtonProps> = ({
   multiple,
   setValue,
   className,
}) => {
   const ref = useRef<HTMLInputElement>(null);
   const onChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const listFile = e.currentTarget.files;
      if (listFile && listFile.length > 0) {
         const array = await Promise.all(
            Array.from(listFile).map((item) => fileToBase64(item))
         );

         const arrayData: Image[] = array.map((item) => ({
            public_id: (Math.random() + 1).toString(36).substring(7),
            url: item,
         }));
         setValue(arrayData);
      }
   };

   return (
      <div
         className={twMerge(
            'relative flex-center h-[100px] w-[100px] p-2 border border-dashed border-table_db dark:border-[#343434] rounded cursor-pointer hover:border-blue-500 duration-200',
            className
         )}
         onClick={() => {
            ref && ref.current && ref.current.click();
         }}
      >
         <input
            ref={ref}
            type='file'
            accept='image/*'
            multiple={multiple}
            hidden
            onChange={onChange}
            onClick={(e) => {
               e.currentTarget.value = '';
            }}
         />
         <div className='absolute translate-x-1/2 -translate-y-1/2 top-1/2 right-1/2'>
            <LuImagePlus size={18} />
         </div>
      </div>
   );
};
export default UploadButton;
