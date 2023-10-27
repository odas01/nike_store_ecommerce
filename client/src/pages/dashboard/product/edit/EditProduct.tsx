import { Spin } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import EditForm from './components/EditForm';
import Title from '@/layouts/dashboard/components/Title';
import { Button, LoadingOverlay, PageTitle, Skeleton } from '@/components';

import { notify } from '@/helpers';
import { productApi } from '@/api';
import { IProduct, ErrorResponse, ProductEdit } from '@/types';

function EditProduct() {
   const { slug } = useParams();
   const navigate = useNavigate();
   const queryClient = useQueryClient();
   const { t } = useTranslation(['dashboard', 'mutual']);

   const { data, isLoading, refetch } = useQuery({
      queryKey: ['product', slug],
      queryFn: () => productApi.get(slug!),
   });

   const convetToFormValue = (data: IProduct): ProductEdit => {
      return {
         ...data,
         category: data.category.name,
         store: data.category.store,
      };
   };

   const editProductMutation = useMutation({
      mutationFn: (values: ProductEdit) => {
         return productApi.update(slug!, values);
      },
      onSuccess: () => {
         refetch();
         navigate(-1);
         queryClient.invalidateQueries({
            queryKey: ['products'],
         });
         notify('success', t('notify.updateSuccess', { ns: 'mutual' }));
      },
      onError: (error: ErrorResponse) => {
         notify('error', error.message);
      },
   });

   const deleteImgs = useMutation({
      mutationFn: (images: string[]) => productApi.deleteImageList(images),
   });

   const submit = async (values: ProductEdit) => {
      editProductMutation.mutate(values);
   };

   const deleteImages = (images: string[]) => {
      deleteImgs.mutate(images);
   };
   return (
      <>
         <PageTitle title='Edit product' />
         <Title title={t('product.editTitle')} />
         {editProductMutation.isLoading && (
            <LoadingOverlay>
               <Spin size='large' />
            </LoadingOverlay>
         )}
         <div className='flex justify-end mt-4'>
            <Button
               className='h-8 px-5 ml-auto duration-150 bg-green-500 hover:bg-green-600'
               onClick={() => navigate(`/dashboard/products/${slug}/variants`)}
            >
               {t('variant.title')}
            </Button>
         </div>
         <div className='py-4'>
            {isLoading ? (
               <Skeleton />
            ) : (
               data && (
                  <EditForm
                     value={convetToFormValue(data)}
                     {...{ submit, deleteImages }}
                  />
               )
            )}
         </div>
      </>
   );
}

export default EditProduct;
