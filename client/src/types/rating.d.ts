import { IOrder, IProduct, IUser, ListWithParams } from '.';

export interface IRating {
   _id: string;
   user: IUser;
   order: IOrder;
   product: IProduct;
   rate: number;
   comment: string;
   createdAt: Date;
}

export type RatingUpload = Pick<IRating, 'rate' | 'comment'> & {
   user: string;
   order: string;
   product: string;
};

export interface RateCount {
   rate: number;
   count: number;
}

export type AllRatings = ListWithParams & {
   ratings: IRating[];
   rateCount: RateCount[];
};

export interface AvgRating {
   avg: number;
   length: number;
   rateCount: RateCount[];
}
