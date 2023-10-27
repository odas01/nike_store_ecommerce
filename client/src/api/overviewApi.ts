import { privateClient } from '@/api/config';
export const overviewApi = {
   order: async () => (await privateClient.get<any>('overview/order')).data,
};
