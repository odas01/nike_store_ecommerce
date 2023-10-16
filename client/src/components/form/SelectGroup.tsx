import { forwardRef, ComponentProps, ReactNode } from 'react';

export type OptionType = {
   label: string | ReactNode;
   value: string;
};

export type GroupOptionType = {
   name: string;
   options: OptionType[];
};

interface SelectGroupProps extends ComponentProps<'select'> {
   groupOption: GroupOptionType[];
   hiddenOption?: GroupOptionType;
   isError?: boolean;
}

const SelectGroup = forwardRef<HTMLSelectElement, SelectGroupProps>(
   ({ groupOption, hiddenOption, isError, className, ...props }, ref) => {
      return (
         <select
            ref={ref}
            className={`px-3 py-2 text-sm rounded border border-solid dark:bg-[#111315]
            ${
               isError
                  ? 'border-red-500'
                  : 'border-gray-400 dark:border-[#3f4244] focus:border-gray-500 dark:focus:border-gray-500'
            } ${className}`}
            {...props}
         >
            {/* {hiddenOption && (
               <option value={hiddenOption.value} hidden>
                  {hiddenOption.label}
               </option>
            )} */}
            {groupOption.map((item, index) => (
               <optgroup
                  label={item.name}
                  key={index}
                  className='capitalize font-semibold'
               >
                  {item.options.map((cate, indexCate) => (
                     <option value={cate.value} key={indexCate}>
                        {cate.label}
                     </option>
                  ))}
               </optgroup>
            ))}
         </select>
      );
   }
);

export default SelectGroup;
