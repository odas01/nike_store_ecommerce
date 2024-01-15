import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import CreateForm from './components/CreateForm';
import Title from '@/layouts/dashboard/components/Title';
import { LoadingOverlay, PageTitle } from '@/components';

import { notify } from '@/helpers';
import { productApi } from '@/api';
import { ProductFormValue } from '@/types';

const DEFAULT_FORM_VALUE: ProductFormValue = {
   name: '',
   store: '',
   category: '',
   discount: 0,
   prices: {
      originalPrice: 0,
      price: 0,
   },
   genders: [],
   desc: '',
   sizes: [
      {
         size: '',
         stock: 50,
      },
   ],
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
   const { t, i18n } = useTranslation(['dashboard', 'mutual']);
   const isVnLang = i18n.language === 'vi';
   const createProductMutation = useMutation({
      mutationFn: (values: ProductFormValue) => {
         return productApi.create(values);
      },
      onSuccess: ({ message }) => {
         navigate(-1);
         queryClient.invalidateQueries({
            queryKey: ['products'],
         });
         notify('success', isVnLang ? message.vi : message.en);
      },

      onError: ({ message }) => {
         notify('error', isVnLang ? message.vi : message.en);
      },
   });

   const submit = (values: ProductFormValue) => {
      createProductMutation.mutate(values);
   };

   return (
      <>
         <PageTitle title='Create product' />
         <Title title={t('product.createTitle')} />
         {createProductMutation.isLoading && <LoadingOverlay />}
         <div className='py-4 mt-4'>
            <CreateForm value={DEFAULT_FORM_VALUE} submit={submit} />
         </div>
      </>
   );
}

export default CreateProduct;
