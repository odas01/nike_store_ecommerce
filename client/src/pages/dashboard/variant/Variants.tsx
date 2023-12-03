import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';

import VariantForm from './components/VariantForm';
import Title from '@/layouts/dashboard/components/Title';
import { Button, LoadingOverlay, PageTitle } from '@/components';

import { productApi } from '@/api';

const Variants = () => {
   const { slug } = useParams();
   const navigate = useNavigate();
   const { t } = useTranslation(['dashboard', 'mutual']);

   const { data, isLoading } = useQuery({
      queryKey: ['product', slug],
      queryFn: () => productApi.get(slug!),
      enabled: !!slug,
   });

   return (
      <>
         <PageTitle title='Variants' />
         <Title title={t('variant.title')} />
         {isLoading && <LoadingOverlay />}
         {data && (
            <>
               <div className='flex items-center justify-between mt-4'>
                  <div className='space-x-2'>
                     <span>{data.name}</span>
                     <span className='lowercase'>
                        ({data.variants.length}{' '}
                        {t('label.variant', { ns: 'mutual' })})
                     </span>
                  </div>
                  <Button
                     className='h-8 px-5 duration-150 bg-green-500 hover:bg-green-600'
                     onClick={() => navigate('create')}
                  >
                     + {t('action.addVariant')}
                  </Button>
               </div>
               <div className='mt-4 space-y-8'>
                  {data &&
                     data.variants.map((item, index) => (
                        <VariantForm
                           key={index}
                           product={data}
                           value={{
                              ...item,
                              color: item.color.name,
                              product_id: data._id,
                           }}
                           isDelete={data.variants.length > 1}
                        />
                     ))}
               </div>
            </>
         )}
      </>
   );
};

export default Variants;
