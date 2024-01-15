import { privateClient, publicClient } from '@/api/config';
import {
   AllCoupons,
   CouponFormUpload,
   CouponResponse,
   ICoupon,
   IMessage,
} from '@/types';

export const couponApi = {
   getAll: async (params?: any) =>
      (await publicClient.get<AllCoupons>('coupons', { params })).data,

   create: async (values: CouponFormUpload) =>
      (await privateClient.post<CouponResponse>('coupons', values)).data,
   update: async (id: string, values: CouponFormUpload) =>
      (await privateClient.put<CouponResponse>(`coupons/${id}`, values)).data,
   delete: async (id: string) =>
      (await privateClient.delete<IMessage>(`coupons/${id}`)).data,
   send: async (id: string) =>
      (await privateClient.post<IMessage>(`coupons/${id}/send`)).data,
   check: async (code: string) =>
      (await privateClient.get<ICoupon>(`coupons/${code}`)).data,
};
