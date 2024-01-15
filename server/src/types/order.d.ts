import { Document, ObjectId } from 'mongoose';

export interface IOrder extends Document {
   user: ObjectId;
   coupon: ObjectId;
   address: string;
   total: number;
   subTotal: number;
   message: string;
   status: number;
}

export interface IOrderDetail extends Document {
   order: ObjectId;
   product: ObjectId;
   price: number;
   size: number;
   quantity: number;
}

export interface ICoupon extends Document {
   name: string;
   type: string;
   code: string;
   value: number;
   quantity: number;
   expirationDate: Date;
}
