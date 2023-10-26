import { ICoupon, IProduct, IUser, ListWithParams, Variant } from '.';

interface Product {
   product: IProduct;
   variant: Variant;
   name: string;
   thumbnail: string;
   price: number;
   qty: number;
   size: string;
}
type OrderProductUpload = Omit<Product, 'product' | 'variant'> & {
   product: string;
   variant: string;
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
