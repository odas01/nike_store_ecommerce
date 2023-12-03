import { privateClient, publicClient } from '@/api/config';
import {
   IProduct,
   AllProducts,
   ProductFormValue,
   ProductEdit,
   ProductReponse,
   IMessage,
} from '@/types';

export const productApi = {
   get: async (slug: string, params?: any) =>
      (await privateClient.get<IProduct>(`products/d/${slug}`, { params }))
         .data,
   getAll: async (params: any) =>
      (await publicClient.get<AllProducts>('products', { params })).data,

   create: async (data: ProductFormValue) =>
      (await privateClient.post<ProductReponse>('products', data)).data,
   update: async (slug: string, data: ProductEdit) =>
      (await privateClient.put<ProductReponse>(`products/d/${slug}`, data))
         .data,
   delete: async (slug: string) =>
      (await privateClient.delete<IMessage>(`products/d/${slug}`)).data,

   similar: async (slug: string, params: any) =>
      (
         await privateClient.get<AllProducts>(`products/d/${slug}/similar`, {
            params,
         })
      ).data,

   deleteImageList: async (images: string[]) =>
      (
         await privateClient.post<{}>(`products/deleteImages`, {
            images,
         })
      ).data,

   count: async () =>
      (
         await privateClient.get<{
            count: number;
         }>(`products/count`)
      ).data,
};
