import { twMerge } from 'tailwind-merge';
import { ComponentProps, forwardRef } from 'react';

export interface ButtonProps extends ComponentProps<'button'> {}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
   ({ children, className, ...props }, ref) => {
      return (
         <button
            ref={ref}
            {...props}
            className={twMerge(
               'rounded-[6px] h-10 py-1 px-4 bg-[#1890ff] hover:bg-[#40a9ff] duration-150 text-white text-sm',
               className
            )}
         >
            {children}
         </button>
      );
   }
);

export default Button;
