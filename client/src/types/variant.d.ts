import { Image, Message, Size } from '.';

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

export interface VariantResponse {
   variant: Variant;
   message: Message;
}
