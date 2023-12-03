import { ListWithParams, Message } from '.';

export interface ICoupon {
   _id: string;
   name: string;
   code: string;
   value: number;
   type: string;
   quantity: number;
   used: number;
   expirationDate: Date;
   createdAt: Date;
}

export type CouponFormUpload = Pick<
   ICoupon,
   'name' | 'code' | 'value' | 'type' | 'quantity' | 'expirationDate'
>;

export type AllCoupons = ListWithParams & {
   coupons: ICoupon[];
};

export interface CouponResponse {
   coupon: ICoupon;
   message: Message;
}
