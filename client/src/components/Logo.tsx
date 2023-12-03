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
      >
         <img src={images.logo} alt='logo' className='w-full h-full' />
      </div>
   );
};

export default Logo;
