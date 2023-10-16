interface FooterProps {
   children: React.ReactNode;
}

const Footer: React.FC<FooterProps> = ({ children }) => {
   return (
      <div className='p-3 font-medium bg-[#cbcbcb] dark:bg-[#232323]'>
         {children}
      </div>
   );
};

export default Footer;
