import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
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

   const { t, i18n } = useTranslation(['dashboard', 'mutual']);
   const isVnLang = i18n.language === 'vi';

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
      onSuccess: ({ message }) => {
         refetch();
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
         {editProductMutation.isLoading && <LoadingOverlay />}
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
