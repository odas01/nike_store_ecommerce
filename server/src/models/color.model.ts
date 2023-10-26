import { Schema, model } from 'mongoose';

import { IColor } from '../types/category.type';

const colorSchema = new Schema(
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
      value: {
         type: String,
         required: true,
         lowercase: true,
      },
   },
   { timestamps: true }
);

export default model<IColor>('Color', colorSchema);
