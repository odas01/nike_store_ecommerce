import { useState, useEffect } from 'react';

const useDarkMode = (): [isDarkMode: boolean, toggleDarkMode: () => void] => {
   const [isDarkMode, setIsDarkMode] = useState<boolean>(
      () => localStorage.getItem('theme') === 'dark'
   );

   useEffect(() => {
      const html = window.document.documentElement;
      html.classList.remove(!isDarkMode ? 'dark' : 'light');
      html.classList.add(isDarkMode ? 'dark' : 'light');
      localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
   }, [isDarkMode]);

   const toggleDarkMode = () => {
      setIsDarkMode(!isDarkMode);
   };

   return [isDarkMode, toggleDarkMode];
};

export default useDarkMode;
