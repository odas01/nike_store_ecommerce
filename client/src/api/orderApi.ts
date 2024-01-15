import { privateClient, publicClient } from '@/api/config';
import {
   AllOrders,
   OrderUpload,
   OrderResponse,
   DbCount,
   DbAmount,
   DbChart,
   IMessage,
   IOrder,
} from '@/types';

export const orderApi = {
   get: async (id: string) =>
      (await privateClient.get<IOrder>(`orders/${id}`)).data,
   getAll: async (params?: any) =>
      (await privateClient.get<AllOrders>('orders', { params })).data,

   create: async (data: OrderUpload) =>
      (await privateClient.post<OrderResponse>('orders', data)).data,
   update: async (id: string, data: any) =>
      (await privateClient.put<OrderResponse>(`orders/${id}`, data)).data,
   delete: async (id: string) =>
      (await privateClient.delete<IMessage>(`orders/${id}`)).data,

   product: async () => (await privateClient.get(`orders/products`)).data,

   createPayment: async (data: any) =>
      (
         await privateClient.post<{ vnpUrl: string }>(
            `orders/create-payment`,
            data
         )
      ).data,

   dashboardCount: async () =>
      (await privateClient.get<DbCount>(`orders/dashboard-count`)).data,

   dashboardAmount: async () =>
      (await privateClient.get<DbAmount>(`orders/dashboard-amount`)).data,

   dashboardChart: async () =>
      (await privateClient.get<DbChart>(`orders/dashboard-chart`)).data,
};
