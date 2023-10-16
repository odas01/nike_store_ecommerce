import { productApi } from '@/api';
import { Button, LoadingOverlay, PageTitle } from '@/components';
import Title from '@/layouts/dashboard/components/Title';
import { useQuery } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import VariantForm from './components/VariantForm';
import { Spin } from 'antd';
const Variants = () => {
   const { slug } = useParams();
   const navigate = useNavigate();

   const { data, isLoading } = useQuery({
      queryKey: ['product', slug],
      queryFn: () => productApi.get(slug!),
   });

   return (
      <>
         <PageTitle title='Variants' />
         <Title title='Variants' />
         {isLoading && (
            <LoadingOverlay>
               <Spin size='large' />
            </LoadingOverlay>
         )}
         {data && (
            <>
               <div className='flex items-center justify-between mt-4'>
                  <div className='space-x-2'>
                     <span>Name: {data.name}</span>
                     <span>({data.variants.length} variants)</span>
                  </div>
                  <Button
                     className='h-8 px-5 duration-150 bg-green-500 hover:bg-green-600'
                     onClick={() => navigate('create')}
                  >
                     + Add variant
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
                        />
                     ))}
               </div>
            </>
         )}
      </>
   );
};

export default Variants;
