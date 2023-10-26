import { twMerge } from 'tailwind-merge';

interface TagProps {
   title: string;
   height?: number | string;
   width?: number | string;
   className?: string;
}

const Tag: React.FC<TagProps> = ({ title, width, height, className }) => {
   return (
      <span
         className={twMerge(
            'inline-block px-2.5 py-0.5 rounded-full text-[11px] text-center min-w-[60px] text-white bg-blue-500',
            className
         )}
         style={{
            width: `${width}px`,
            height: `${height}px`,
         }}
      >
         {title}
      </span>
   );
};

export default Tag;
