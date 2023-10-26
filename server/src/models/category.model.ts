import { Schema, model } from 'mongoose';

import { ICategory } from '../types/category.type';

const categorySchema = new Schema(
   {
      name: {
         type: String,
         lowercase: true,
         trim: true,
         required: true,
      },
      vnName: {
         type: String,
         lowercase: true,
         trim: true,
         required: true,
      },
      store: {
         type: String,
         required: true,
         enum: ['shoes', 'clothing', 'gear'],
         lowercase: true,
      },
      status: {
         type: String,
         enum: ['show', 'hide'],
         default: 'show',
      },
   },
   { timestamps: true }
);

export default model<ICategory>('Category', categorySchema);
