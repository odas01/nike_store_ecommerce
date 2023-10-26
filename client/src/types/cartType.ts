import { IProduct, Variant } from '.';

type Product = Pick<IProduct, 'name' | 'discount' | 'slug' | 'prices'> & {
   _id: string;
};

export interface ICartItem {
   _id: string;
   product: Product;
   variant: Variant & { _id: string };
   size: string;
   qty: number;
   isMax?: boolean;
}

export interface CartUpload {
   variant: string;
   qty: number;
   size: string;
}
export type CartItemUpdate = Omit<CartUpload, 'product'>;
