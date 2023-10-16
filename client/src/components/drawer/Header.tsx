interface HeaderProps {
   children: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({ children }) => {
   return (
      <div className='p-3 font-medium bg-[#cbcbcb] dark:bg-[#232323]'>
         {children}
      </div>
   );
};

export default Header;
