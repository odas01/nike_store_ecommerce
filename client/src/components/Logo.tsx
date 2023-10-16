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
            height: width / 5,
         }}
      >
         <img
            src={isDarkMode ? images.logo_dark : images.logo_home}
            alt='logo'
         />
      </div>
   );
};

export default Logo;
