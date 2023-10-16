import images from '@/assets/images';
import { ThemeContext } from '@/providers/ThemeProvider';
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
            height: width * (11 / 20),
         }}
      >
         <img src={images.logo_new} alt='logo' className='w-full h-full' />
      </div>
   );
};

export default Logo;
