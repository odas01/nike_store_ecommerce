import { forwardRef, ComponentProps } from 'react';

interface TextAreaProps extends ComponentProps<'textarea'> {
   isError?: boolean;
}

const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
   ({ isError, className, ...props }, ref) => {
      return (
         <textarea
            ref={ref}
            className={`px-3 py-2 text-sm rounded border border-solid
               dark:text-[#d5d6d7] ${
                  isError
                     ? 'border-red-500'
                     : 'border-gray-400 dark:border-[#3f4244] focus:border-gray-500 dark:focus:border-gray-500'
               } ${className}`}
            {...props}
         />
      );
   }
);

export default TextArea;
