import { privateClient, publicClient } from '@/api/config';
import { IProduct, AllProducts, ProductFormValue, ProductEdit } from '@/types';

export const productApi = {
   get: async (slug: string) =>
      (await privateClient.get<IProduct>(`products/d/${slug}`)).data,
   getAll: async (params: any) =>
      (await privateClient.get<AllProducts>('products', { params })).data,

   create: async (data: ProductFormValue) =>
      (await privateClient.post<IProduct>('products', data)).data,
   update: async (slug: string, data: ProductEdit) =>
      (await privateClient.put<IProduct>(`products/d/${slug}`, data)).data,
   delete: async (slug: string) =>
      (await privateClient.delete<{}>(`products/d/${slug}`)).data,

   deleteImageList: async (images: string[]) =>
      (
         await privateClient.post<{}>(`products/color/deleteImages`, {
            images,
         })
      ).data,
   bestSeller: async (params: any) =>
      (await publicClient.get<AllProducts>('products/bestseller', { params }))
         .data,
};
