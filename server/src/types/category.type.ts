import { Document } from 'mongoose';

export interface ICategory extends Document {
   name: string;
   store: string;
   status: 'show' | 'hide';
}

export interface IColor extends Document {
   name: string;
   value: string;
}

export interface ISize extends Document {
   name: string;
   store: string;
}
