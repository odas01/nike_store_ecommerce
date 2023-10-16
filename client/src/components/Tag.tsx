import { twMerge } from 'tailwind-merge';

interface TagProps {
   title: string;
   height?: number | string;
   width?: number | string;
   className?: string;
}

const Tag: React.FC<TagProps> = ({ title, width, height, className }) => {
   return (
      <div
         className={twMerge(
            'px-2 py-1 text-[11px] text-center rounded min-w-[72px] text-white bg-blue-500',
            className
         )}
         style={{
            width: `${width}px`,
            height: `${height}px`,
         }}
      >
         {title}
      </div>
   );
};

export default Tag;
