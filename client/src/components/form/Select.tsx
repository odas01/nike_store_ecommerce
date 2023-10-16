import { forwardRef, ComponentProps, ReactNode } from 'react';

export type OptionType = {
   label: string | ReactNode;
   value: string;
};

interface SelectProps extends ComponentProps<'select'> {
   options: OptionType[];
   hiddenOption?: OptionType;
   isError?: boolean;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
   ({ options, hiddenOption, isError, className, ...props }, ref) => {
      return (
         <select
            ref={ref}
            className={`px-3 py-2 text-sm rounded border border-solid bg-[#fefefe] dark:text-white dark:bg-[#1A1C23] capitalize
            ${
               isError
                  ? 'border-red-500'
                  : 'border-gray-400 dark:border-[#3f4244] focus:border-gray-500 dark:focus:border-gray-500'
            } ${className}`}
            {...props}
         >
            {hiddenOption && (
               <option value={hiddenOption.value} hidden>
                  {hiddenOption.label}
               </option>
            )}
            {options.map((item, index) => (
               <option key={index} value={item.value}>
                  {item.label}
               </option>
            ))}
         </select>
      );
   }
);

export default Select;
