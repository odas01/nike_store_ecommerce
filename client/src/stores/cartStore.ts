import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { cartApi } from '@/api';
import { notify } from '@/helpers';
import { CartItemUpLoad, ICartItem } from '@/types';

type Store = {
   qty: number;
   cart: ICartItem[];
   subTotal: number;
};

type Actions = {
   updateCart: (id: string, item: ICartItem) => void;
   getCart: () => Promise<void>;
   deleteCart: () => void;
};

const initialState = {
   qty: 0,
   cart: [],
   subTotal: 0,
};

const cartStore = create<Store & Actions>()(
   persist(
      (set, get) => ({
         ...initialState,
         updateCart: (id, item) => {
            const cart = get().cart;
            const index = get().cart.findIndex((item) => item._id === id);
            cart[index] = item;
            set({
               subTotal: cart.reduce(
                  (cur, item) => cur + item.qty * item.product.prices.price,
                  0
               ),
            });
         },
         getCart: async () => {
            try {
               const { items, total } = await cartApi.get();

               set({
                  cart: items,
                  qty: total,
                  subTotal: items.reduce((cur, item) => {
                     if (item.product) {
                        return cur + item.product.prices.price * item.qty;
                     }
                     return cur;
                  }, 0),
               });
            } catch (err) {
               set({
                  cart: [],
                  qty: 0,
                  subTotal: 0,
               });
            }
         },
         deleteCart: () => {
            set({
               cart: [],
               qty: 0,
            });
         },
      }),
      {
         name: 'cart-store',
      }
   )
);

export default cartStore;
