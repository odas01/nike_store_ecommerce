import { Document, ObjectId } from 'mongoose';

export interface Image {
   public_id: string;
   url: string;
}

interface Size {
   size: string;
   stock: number;
}
interface Prices {
   originalPrice: number;
   price: number;
}

export interface IVariant extends Document {
   color: ObjectId;
   thumbnail: Image;
   images: Image[];
   sizes: Size[];
}

export interface IProduct extends Document {
   category: ObjectId;
   name: string;
   slug: string;
   genders: string[];
   discount: number;
   prices: Prices;
   desc: string;
   variants: [ObjectId];
   view: number;
   sold: number;
   status: string;
}

export interface ICartItem extends Document {
   user: ObjectId;
   product: ObjectId;
   variant: ObjectId;
   size: string;
   qty: number;
}
