import images from '@/assets/images';
import { ThemeContext } from '@/route/ThemeRoute';
import React, { useContext } from 'react';

type LogoProps = {
   width: number;
};

const Logo: React.FC<LogoProps> = ({ width }) => {
   const { isDarkMode } = useContext(ThemeContext);

   return (
      <div
         style={{
            width: width,
            height: width * (1 / 4),
         }}
      >
         <img src={images.logo2} alt='logo' className='w-full h-full' />
      </div>
   );
};

export default Logo;
