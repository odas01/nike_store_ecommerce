import { Image } from '.';

interface Size {
   size: string;
   stock: number;
}

interface Color {
   name: string;
   vnName: string;
   value: string;
}

export interface Variant {
   _id?: string;
   color: Color;
   sizes: Size[];
   thumbnail: Image;
   images: Image[];
}

export type VariantForm = Omit<Variant, 'color'> & {
   color: string;
   product_id: string;
};
