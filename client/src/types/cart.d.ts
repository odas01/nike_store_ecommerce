import { IProduct, Variant } from '.';

type iProduct = Pick<IProduct, 'name' | 'discount' | 'slug' | 'prices'> & {
   _id: string;
};

export interface ICartItem {
   _id: string;
   product: iProduct;
   variant: Variant & { _id: string };
   size: string;
   qty: number;
}

export interface CartItemUpLoad {
   variant: string;
   qty: number;
   size: string;
}

export type CartItemUpdate = Omit<CartItemUpLoad, 'product'>;

export interface CartResponse {
   items: ICartItem[];
   total: number;
}
