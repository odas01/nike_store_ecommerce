import { Document, ObjectId } from 'mongoose';

interface Image {
   cloudinary_id: string;
   url: string;
}

export interface IUser extends Document {
   name: string;
   email: string;
   password?: string;
   phone: string;
   avatar: Image;
   address: string;
   role: string;
   status: string;
}

export interface IRaiting extends Document {
   product: ObjectId;
   customer: ObjectId;
   rate: number;
   comment: string;
   isShow: boolean;
}
