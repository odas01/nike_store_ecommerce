import { privateClient, publicClient } from '@/api/config';
import { AllCoupons, ICoupon, CouponForm } from '@/types';

export const couponApi = {
   getAll: async (params?: any) =>
      (await publicClient.get<AllCoupons>('coupons', { params })).data,

   create: async (values: CouponForm) =>
      (await privateClient.post<ICoupon>('coupons', values)).data,
   check: async (code: string) =>
      (await privateClient.get<ICoupon>(`coupons/${code}`)).data,
   update: async (id: string, values: CouponForm) =>
      (await privateClient.put<ICoupon>(`coupons/${id}`, values)).data,
   delete: async (id: string) =>
      (await privateClient.delete<ICoupon>(`coupons/${id}`)).data,
};
