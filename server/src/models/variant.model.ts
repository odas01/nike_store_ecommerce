import { Schema, model } from 'mongoose';

import { IVariant } from '../types/product';

const schema = new Schema<IVariant>({
   color: {
      type: Schema.Types.ObjectId,
      ref: 'Color',
   },
   sizes: [
      {
         _id: false,
         size: {
            type: String,
            required: true,
         },
         stock: {
            type: Number,
            required: true,
         },
      },
   ],
   thumbnail: {
      public_id: {
         type: String,
      },
      url: {
         type: String,
         required: true,
      },
   },
   images: [
      {
         _id: false,
         public_id: {
            type: String,
         },
         url: {
            type: String,
         },
      },
   ],
});

export default model<IVariant>('Variant', schema);
