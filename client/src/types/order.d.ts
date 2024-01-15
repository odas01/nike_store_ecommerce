import {
   ICoupon,
   IProduct,
   IRating,
   IUser,
   ListWithParams,
   Message,
   Variant,
} from '.';

export interface Product {
   product: IProduct;
   variant: Variant;
   rating: IRating;
   name: string;
   thumbnail: string;
   price: number;
   qty: number;
   size: string;
   isRating?: boolean;
}

type OrderProductUpload = {
   product: string;
   variant: string;
   name: string;
   price: number;
   thumbnail: string;
   qty: number;
   size: string;
};

export interface IOrder {
   _id: string;
   user: IUser;
   phone: string;
   address: string;
   subTotal: number;
   total: number;
   message: string;
   coupon: ICoupon;
   discount: number;
   products: Product[];
   paymentMethod: string;
   paid: boolean;
   shippingCost: number;
   status: string;
   createdAt: Date;
}

export type OrderUpload = {
   address: string;
   total: number;
   phone: string;
   subTotal: number;
   coupon?: string;
   discount: number;
   message: string;
   paymentMethod?: string;
   paid: boolean;
   shippingCost: number;
   products: OrderProductUpload[];
};

export interface AllOrders extends ListWithParams {
   orders: IOrder[];
}

export interface OrderResponse {
   order: IOrder;
   message: Message;
}

export interface DbCount {
   orders: {
      count: number;
      status: string;
   }[];
}

export interface DbAmount {
   toDayOrder: {
      total: number;
      method: 'cash' | 'paypal';
   }[];
   yesterdayOrder: {
      total: number;
      method: 'cash' | 'paypal';
   }[];
   thisMonthAmount: number;
   lastMonthAmount: number;
   totalAmount: number;
}

export interface DbChart {
   orders: [
      {
         count: number;
         date: string;
      },
      {
         count: number;
         date: string;
      },
      {
         count: number;
         date: string;
      }
   ];
}
