import { Document } from 'mongoose';

export interface ICategory extends Document {
   name: string;
   vnName: string;
   store: string;
   status: string;
}

export interface IColor extends Document {
   name: string;
   vnName: string;
   value: string;
}

export interface ISize extends Document {
   name: string;
   store: string;
}
