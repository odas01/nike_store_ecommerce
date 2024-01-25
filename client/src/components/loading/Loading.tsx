import { ThemeContext } from '@/providers/ThemeProvider';
import { useContext } from 'react';
import PulseLoader from 'react-spinners/PulseLoader';

function Loading() {
   const { isDarkMode } = useContext(ThemeContext);
   return (
      <div className='w-screen h-screen text-[#272727] bg-[#fefefe] dark:text-white dark:bg-[#1A1C23]'>
         <div className='flex items-center p-4'>
            <span className='mr-2'>Loading</span>
            <PulseLoader
               color={`${isDarkMode ? 'white' : 'black'}`}
               loading={true}
               size={5}
               speedMultiplier={0.8}
            />
         </div>
      </div>
   );
}

export default Loading;
