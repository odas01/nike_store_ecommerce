import { privateClient } from '@/api/config';
import { AllRatings, IRating, RatingUpload } from '@/types';

export const ratingApi = {
   getAll: async (params: any) =>
      (
         await privateClient.get<AllRatings>('ratings', {
            params,
         })
      ).data,
   create: async (data: RatingUpload) =>
      (await privateClient.post<IRating>('ratings', data)).data,
   update: async (id: string, data: RatingUpload) =>
      (await privateClient.put<IRating>(`ratings/${id}`, data)).data,
   delete: async (id: string) =>
      (await privateClient.delete<{}>(`ratings/${id}`)).data,
};
