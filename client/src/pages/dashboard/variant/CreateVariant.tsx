import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';

import VariantForm from './components/VariantForm';
import Title from '@/layouts/dashboard/components/Title';
import { LoadingOverlay, PageTitle } from '@/components';

import { productApi } from '@/api';
import { VariantForm as VariantFormValue } from '@/types';

const DEFAULT_FORM_VALUE: VariantFormValue = {
   product_id: '',
   color: '',
   sizes: [],
   thumbnail: {
      public_id: '',
      url: '',
   },
   images: [],
};

function CreateVariant() {
   const { slug } = useParams();
   const { t } = useTranslation(['dashboard']);

   const { data, isLoading } = useQuery({
      queryKey: ['product', slug],
      queryFn: () => productApi.get(slug!),
   });

   return (
      <>
         <PageTitle title='Add variant' />
         <Title title={t('variant.createTitle')} />
         {isLoading && <LoadingOverlay />}
         {data && (
            <>
               <div className='flex items-center justify-between h-8 mt-4'>
                  <div className='space-x-2'>
                     <span>Name: {data.name}</span>
                     <span>({data.variants.length} variants)</span>
                  </div>
               </div>
               <div className='mt-4'>
                  {data && (
                     <VariantForm product={data} value={DEFAULT_FORM_VALUE} />
                  )}
               </div>
            </>
         )}
      </>
   );
}

export default CreateVariant;
