import { model, Schema } from 'mongoose';

import { ICoupon } from '../types/order';

const schema = new Schema(
   {
      name: {
         type: String,
         required: true,
      },
      code: {
         type: String,
         required: true,
      },
      type: {
         type: String,
         required: true,
      },
      value: {
         type: Number,
         required: true,
      },
      quantity: {
         type: Number,
         required: true,
      },
      expirationDate: {
         type: Date,
         default: () => new Date(+new Date() + 3 * 24 * 60 * 60 * 1000),
      },
   },
   { timestamps: true }
);

export default model<ICoupon>('Coupon', schema);
