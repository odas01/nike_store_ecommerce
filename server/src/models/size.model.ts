import { Schema, model } from 'mongoose';

import { ISize } from '../types/category';

const sizeSchema = new Schema(
   {
      name: {
         type: String,
         lowercase: true,
         trim: true,
         required: true,
      },
      store: {
         type: String,
         enum: ['shoes', 'clothing', 'accessories'],
         required: true,
      },
   },
   { timestamps: true }
);

export default model<ISize>('Size', sizeSchema);
