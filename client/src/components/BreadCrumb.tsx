import { Breadcrumb as BreadcrumbAntd } from 'antd';
import { BreadcrumbProps } from 'antd/es/breadcrumb/Breadcrumb';
import { twMerge } from 'tailwind-merge';

interface IBreadCrumbProps extends BreadcrumbProps {}

const BreadCrumb: React.FC<IBreadCrumbProps> = ({ items, className }) => {
   return (
      <BreadcrumbAntd
         className={twMerge(
            '!text-15 py-4 uppercase xl:block hidden',
            className
         )}
         separator={
            <div className='flex h-full'>
               <span className='h-[0.5px] w-6 bg-black inline-block my-auto' />
            </div>
         }
         items={items}
      />
   );
};

export default BreadCrumb;
