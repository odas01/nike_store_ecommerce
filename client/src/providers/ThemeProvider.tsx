import {
   FC,
   ReactNode,
   createContext,
   useState,
   Dispatch,
   SetStateAction,
   useLayoutEffect,
} from 'react';

interface ThemeContext {
   isDarkMode: boolean;
   setIsDarkMode: Dispatch<SetStateAction<boolean>>;
}

export const ThemeContext = createContext<ThemeContext>({} as ThemeContext);

const ThemeProvider: FC<{
   children: ReactNode;
}> = ({ children }) => {
   const [isDarkMode, setIsDarkMode] = useState<boolean>(
      localStorage.getItem('theme') === 'dark' ? true : false
   );
   useLayoutEffect(() => {
      const html = window.document.documentElement;
      html.classList.remove(!isDarkMode ? 'dark' : 'light');
      html.classList.add(isDarkMode ? 'dark' : 'light');
      localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
   }, [isDarkMode]);

   return (
      <ThemeContext.Provider value={{ isDarkMode, setIsDarkMode }}>
         {children}
      </ThemeContext.Provider>
   );
};

export default ThemeProvider;
