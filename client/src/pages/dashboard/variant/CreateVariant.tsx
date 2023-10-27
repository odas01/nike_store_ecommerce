import { useTranslation } from 'react-i18next';

import Title from '@/layouts/dashboard/components/Title';
import { Button, LoadingOverlay, PageTitle } from '@/components';
import { VariantForm as VariantFormValue } from '@/types';
import VariantForm from './components/VariantForm';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { productApi } from '@/api';
import { Spin } from 'antd';

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
   const navigate = useNavigate();
   const { t } = useTranslation(['dashboard']);

   const { data, isLoading } = useQuery({
      queryKey: ['product', slug],
      queryFn: () => productApi.get(slug!),
   });

   return (
      <>
         <PageTitle title='Add variant' />
         <Title title={t('variant.createTitle')} />
         {isLoading && (
            <LoadingOverlay>
               <Spin size='large' />
            </LoadingOverlay>
         )}
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
