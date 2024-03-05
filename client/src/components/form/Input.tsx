import { forwardRef, ComponentProps } from 'react';
import { twMerge } from 'tailwind-merge';

interface InputProps extends ComponentProps<'input'> {
   isError?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
   ({ isError, className, ...props }, ref) => {
      return (
         <input
            ref={ref}
            className={twMerge(
               'px-3 xl:h-10 md:h-9 h-8 xl:text-sm md:text-13 text-xs text-[#3e3e3e] rounded-md border border-solid cursor-pointer duration-150 dark:text-[#d5d6d7]',
               isError
                  ? 'border-red-500'
                  : 'border-gray-300 dark:border-[#3f4244] focus:cursor-text focus:border-gray-500 dark:focus:border-gray-500',
               className
            )}
            {...props}
         />
      );
   }
);

export default Input;
