import { FiTrash } from 'react-icons/fi';
import { twMerge } from 'tailwind-merge';

const Image: React.FC<{
   url: string;
   onRemove: () => void;
   className?: string;
}> = ({ url, onRemove, className }) => {
   return (
      <div
         className={twMerge(
            'relative w-[100px] aspect-square rounded overflow-hidden',
            className
         )}
      >
         <img src={url} alt='img' />
         <div className='absolute opacity-0 hover:opacity-100 duration-300 left-0 top-0 flex-center gap-3 h-full w-full bg-[rgba(0,0,0,0.3)]'>
            <div className='absolute inline-block p-1 bg-red-500 rounded cursor-pointer right-1 top-1'>
               <FiTrash
                  size={12}
                  className='duration-300 hover:scale-105'
                  onClick={onRemove}
               />
            </div>
         </div>
      </div>
   );
};

export default Image;
