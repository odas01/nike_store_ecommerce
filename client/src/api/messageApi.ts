import { privateClient, publicClient } from '@/api/config';
import { AllCoupons, ICoupon, CouponForm } from '@/types';

export const messageApi = {
   get: async (params?: any) => (await publicClient.get<any>('message')).data,

   create: async (values: CouponForm) =>
      (await privateClient.post<any>('message', values)).data,
   check: async (code: string) =>
      (await privateClient.get<any>(`message/${code}`)).data,
   update: async (id: string, values: CouponForm) =>
      (await privateClient.put<any>(`message/${id}`, values)).data,
   delete: async (id: string) =>
      (await privateClient.delete<any>(`message/${id}`)).data,
};
