import images from '@/assets/images';

type LogoProps = {
   width: number;
   isWhite?: boolean;
};

const Logo: React.FC<LogoProps> = ({ width, isWhite = false }) => {
   return (
      <div
         style={{
            width: width,
            height: width * (1 / 4),
         }}
         className='flex items-center justify-center'
      >
         <img
            src={isWhite ? images.logo2 : images.logo}
            alt='logo'
            className='w-2/3 md:w-[90%] md:h-[90%] xl:w-full xl:h-full h-2/3'
         />
      </div>
   );
};

export default Logo;
