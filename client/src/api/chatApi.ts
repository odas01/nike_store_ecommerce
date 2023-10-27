import { privateClient, publicClient } from '@/api/config';

export const chatApi = {
   get: async () => (await privateClient.get<any>('chat')).data,
   create: async (customerId?: string) =>
      (
         await privateClient.post<any>('chat', {
            customerId,
         })
      ).data,
};
