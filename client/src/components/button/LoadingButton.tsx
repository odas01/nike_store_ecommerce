import { ComponentProps, FC } from 'react';
import Button, { ButtonProps } from './Button';
import { Spinner } from '..';
import { twMerge } from 'tailwind-merge';

interface LoadingButtonProps extends ButtonProps {
   title: string;
   disabled?: boolean;
   onClick?: () => void;
}

const LoadingButton: FC<LoadingButtonProps> = ({
   title,
   className,
   onClick,
   disabled,
}) => {
   return (
      <Button className={className} disabled={disabled} onClick={onClick}>
         <span className='relative'>
            {title}
            <div className='absolute right-[110%] top-1/2 -translate-y-[60%]'>
               <Spinner width={18} />
            </div>
         </span>
      </Button>
   );
};

export default LoadingButton;
