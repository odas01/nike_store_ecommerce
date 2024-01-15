import { FC, ReactNode } from 'react';

interface TableProps {
   heading: ReactNode;
   children: ReactNode;
   pagination?: ReactNode;
}

const Table: FC<TableProps> = ({ heading, children, pagination }) => {
   return (
      <div className='px-4 rounded-md text-sm overflow-hidden border border-gray-300 dark:border-[#343434] bg-white dark:bg-[#1A1C23]'>
         <table className='w-full'>
            <thead className='font-medium border-b border-inherit text-table_db_thead'>
               {heading}
            </thead>
            <tbody className='divide-y divide-gray-300 dark:divide-[#343434]'>
               {children}
            </tbody>
         </table>
         {pagination}
      </div>
   );
};

export default Table;
