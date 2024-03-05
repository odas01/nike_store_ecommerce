import { FC } from 'react';

interface ErrorProps {
   message?: string;
}

const Error: FC<ErrorProps> = ({ message }) => {
   return (
      <p
         className='font-normal xl:text-[13px] md:text-xs text-10 xl:h-5 h-4 text-transparent text-red-400'
         style={{
            color: message ? '#ff4d4f' : 'transparent',
            transition: 'color .3s cubic-bezier(.215,.61,.355,1)',
         }}
      >
         {message || ' '}
      </p>
   );
};

export default Error;
