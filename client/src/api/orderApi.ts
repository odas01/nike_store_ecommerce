import { privateClient } from '@/api/config';
import { AllOrders, IOrder, OrderUpload } from '@/types/orderType';

export const orderApi = {
   get: async (id: string) => (await privateClient.get(`orders/${id}`)).data,
   getAll: async (params?: any) =>
      (await privateClient.get<AllOrders>('orders', { params })).data,

   create: async (data: OrderUpload) =>
      (await privateClient.post<IOrder>('orders', data)).data,
   delete: async (id: string) =>
      (await privateClient.delete(`orders/${id}`)).data,
   update: async (id: string, data: any) =>
      (await privateClient.put(`orders/${id}`, data)).data,

   dashboardCount: async () =>
      (await privateClient.get(`orders/dashboard-count`)).data,

   dashboardAmount: async () =>
      (await privateClient.get(`orders/dashboard-amount`)).data,

   dashboardChart: async () =>
      (await privateClient.get(`orders/dashboard-chart`)).data,
};
