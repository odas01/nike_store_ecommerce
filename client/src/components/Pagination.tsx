import { twMerge } from 'tailwind-merge';
import { useTranslation } from 'react-i18next';

type Props = {
   page: number;
   lastPage: number;
   total: number;
   currentTotal: number;
   skip: number;
   setSkip: (value: React.SetStateAction<number>) => void;
   limit?: number;
   className?: string;
};

const Pagination: React.FC<Props> = ({
   page,
   lastPage,
   currentTotal,
   total,
   skip,
   setSkip,
   limit = 15,
   className,
}) => {
   const isFirstPage = page === 1;
   const isLastPage = page === lastPage;

   const { t } = useTranslation(['mutual']);
   return (
      <div
         className={twMerge(
            'flex justify-between items-center py-2 px-4 dark:text-gray-400 text-gray-700  border-t dark:border-[#343434] rounded-br-lg rounded-bl-lg bg-db-wrap dark:bg-gray-bg font-medium',
            className
         )}
      >
         <div className='text-xs uppercase'>
            {t('pagination.showing')}{' '}
            <span>
               {skip + 1} - {skip + currentTotal}
            </span>{' '}
            {t('pagination.of')}
            <span> {total}</span>
         </div>
         <ul className='flex justify-between items-center text-[#9e9e9e] mt-0 text-xs'>
            <li className='px-3 py-1'>
               <button
                  className={twMerge(
                     'bg-transparent px-0 dark:text-[#9e9e9e]',
                     isFirstPage
                        ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
                        : 'text-gray-700 cursor-pointer'
                  )}
                  disabled={isFirstPage}
                  onClick={() => setSkip((skip) => skip - limit)}
               >
                  {t('action.previous')}
               </button>
            </li>
            <li className='px-3 py-1'>
               {Array(lastPage)
                  .fill(0)
                  .map((_, index) => {
                     const pageNumber = index + 1;
                     const isActive = pageNumber === page;
                     return (
                        <button
                           key={index}
                           className={twMerge(
                              'px-3 py-1 rounded-lg cursor-pointer',
                              isActive
                                 ? 'text-white bg-[#0e9f6e]'
                                 : 'text-gray-700 dark:text-[#9e9e9e]'
                           )}
                           onClick={() => setSkip(pageNumber * limit - limit)}
                        >
                           {pageNumber}
                        </button>
                     );
                  })}
            </li>
            <li className='px-3 py-1'>
               <button
                  className={twMerge(
                     'bg-transparent px-0 dark:text-[#9e9e9e]',
                     isLastPage
                        ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
                        : 'text-gray-700 cursor-pointer'
                  )}
                  disabled={isLastPage}
                  onClick={() => setSkip((skip) => skip + limit)}
               >
                  {t('action.next')}
               </button>
            </li>
         </ul>
      </div>
   );
};

export default Pagination;
