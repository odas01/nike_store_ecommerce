import images from '@/assets/images';

type LogoProps = {
   width: number;
};

const Logo: React.FC<LogoProps> = ({ width }) => {
   return (
      <div
         style={{
            width: width,
            height: width * (1 / 4),
         }}
         className='flex items-center justify-center'
      >
         <img
            src={images.logo2}
            alt='logo'
            className='w-2/3 md:w-[90%] md:h-[90%] xl:w-full xl:h-full h-2/3'
         />
      </div>
   );
};

export default Logo;
