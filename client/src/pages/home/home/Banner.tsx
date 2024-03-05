import images from '@/assets/images';
import { useTranslation } from 'react-i18next';
import { BsArrowRight } from 'react-icons/bs';
import { Link } from 'react-router-dom';

const Banner = () => {
   const { t } = useTranslation('home');

   return (
      <div className='relative xl:h-screen md:h-[75vh] h-[42vh] bg-banner bg-repeat bg-fixed md:rounded-br md:rounded-bl'>
         <img
            src={images.bannerr}
            alt=''
            className='xl:w-[580px] md:w-64 w-40 absolute xl:right-28 right-2 object-contain'
         />

         <div className='absolute text-white w-min md:w-fit flex-column bottom-4 left-4 xl:top-1/3 xl:left-28'>
            <span className='font-nikeFutura tracking-[8px] xl:text-8xl md:text-6xl text-3xl overflow-hidden whitespace-nowrap animate-typing'>
               JUST DO IT
            </span>
            <span className='mt-2 text-2xl italic md:text-2xl xl:text-3xl font-nikeFutura'>
               Play With Electric Nike Shoes
            </span>
            <Link
               to='/shop'
               className='relative px-3 py-2 mt-16 text-black bg-white rounded-full cursor-pointer md:mt-24 md:px-5 md:py-3 flex-center w-fit group'
            >
               <span className='z-10 mr-4 font-medium duration-300 text-13 md:text-sm xl:text-lg group-hover:text-white'>
                  {t('cart.startShopping')}
               </span>
               <div className='z-10 p-1 rounded-full md:p-1 xl:p-2 flex-center'>
                  <BsArrowRight color='#fff' />
               </div>
               <div className='absolute right-[10px] md:w-10 w-8 aspect-square bg-[#181823] rounded-full duration-300 group-hover:w-[102%] group-hover:h-[102%] group-hover:right-[-1px]' />
            </Link>
         </div>
      </div>
   );
};

export default Banner;
