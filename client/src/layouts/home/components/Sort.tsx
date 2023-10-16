import { useState, memo } from 'react';
import { useTranslation } from 'react-i18next';
import { BsChevronDown } from 'react-icons/bs';

type Props = {
   sort: string;
   setSort: React.Dispatch<React.SetStateAction<string>>;
};

const Sort: React.FC<Props> = ({ sort, setSort }) => {
   // show Sort
   const [show, setShow] = useState<boolean>(false);
   const [text, setText] = useState<string>('');

   const { t } = useTranslation(['home', 'mutual']);

   const handleSort = (e: React.FormEvent<HTMLButtonElement>) => {
      const eventTarget = e.currentTarget;

      const [type, value] = eventTarget.value.split(':');
      if (type && value) setSort(type + ':' + value);
      else setSort('');

      if (eventTarget.value && eventTarget.textContent) {
         setText(eventTarget.textContent);
      } else {
         setText('Default');
      }
      setShow(false);
   };

   const label = [
      {
         text: `${t('label.name', { ns: 'mutual' })}: A > Z`,
         value: 'name:1',
      },
      {
         text: `${t('label.name', { ns: 'mutual' })}: Z > A`,
         value: 'name:-1',
      },
      {
         text: `${t('label.price', { ns: 'mutual' })}: ${t(
            'category.sort.lowHigh'
         )}`,
         value: 'prices.price:1',
      },
      {
         text: `${t('label.price', { ns: 'mutual' })}: ${t(
            'category.sort.highLow'
         )}`,
         value: 'prices.price:-1',
      },
   ];

   return (
      <div className='relative flex gap-5'>
         <span
            className='flex items-center gap-1 font-semibold cursor-pointer'
            onClick={() => setShow(!show)}
         >
            {t('category.sort.sortBy')}:{' '}
            <span className='mx-1 text-sm opacity-75'>{text}</span>{' '}
            <BsChevronDown />
         </span>
         <div className='absolute right-0 z-[100] overflow-hidden top-full w-44 '>
            <div
               className={`relative p-2 flex-column items-end rounded-md border border-gray-100 bg-white duration-500 ${
                  show ? '-top-[4px]' : ' -top-[150px]'
               }`}
            >
               {sort && (
                  <button
                     className='w-full py-1 text-sm cursor-pointer hover:opacity-75 text-end'
                     value='createdAt:-1'
                     onClick={handleSort}
                  >
                     {t('category.sort.latest')}
                  </button>
               )}
               {label.map((item, index) => (
                  <button
                     key={index}
                     className='w-full py-1 text-sm cursor-pointer hover:opacity-75 disabled:opacity-100 text-end'
                     value={item.value}
                     onClick={handleSort}
                     disabled={item.value === sort}
                  >
                     {item.text}
                  </button>
               ))}
            </div>
         </div>
      </div>
   );
};

export default memo(Sort);
