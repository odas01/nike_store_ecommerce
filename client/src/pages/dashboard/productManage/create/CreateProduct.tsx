import { Spin } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import Title from '@/layouts/dashboard/components/Title';
import { LoadingOverlay, PageTitle } from '@/components';
import ProductForm from '../form/ProductForm';

import { notify } from '@/helpers';
import { productApi } from '@/api';
import { ErrorResponse, ProductFormValue } from '@/types';
import CreateForm from './components/CreateForm';

const DEFAULT_FORM_VALUE: ProductFormValue = {
   name: '',
   store: '',
   category: '',
   discount: 5,
   prices: {
      originalPrice: 0,
      price: 0,
   },
   genders: [],
   desc: '',
   sizes: [],
   images: [],
   color: '',
   thumbnail: {
      public_id: '',
      url: '',
   },
};

function CreateProduct() {
   const navigate = useNavigate();
   const queryClient = useQueryClient();
   const { t } = useTranslation('dashboard', { keyPrefix: 'title' });

   const createProductMutation = useMutation({
      mutationFn: (values: ProductFormValue) => {
         return productApi.create(values);
      },
      onSuccess: () => {
         // navigate(-1);
         // queryClient.invalidateQueries({
         //    queryKey: ['products'],
         // });
         // notify('success', 'Created product successfully');
      },
      onError: (error: ErrorResponse) => {
         notify('error', error.message);
      },
   });

   const submit = (values: ProductFormValue) => {
      createProductMutation.mutate(values);
   };

   return (
      <>
         <PageTitle title='Create product' />
         <Title title={t('createProuct')} />
         {createProductMutation.isLoading && (
            <LoadingOverlay>
               <Spin size='large' />
            </LoadingOverlay>
         )}
         <div className='py-4 mt-4'>
            <CreateForm value={DEFAULT_FORM_VALUE} submit={submit} />
         </div>
      </>
   );
}

export default CreateProduct;
