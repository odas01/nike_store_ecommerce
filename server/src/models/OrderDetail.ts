import { model, Schema } from 'mongoose';

import { IOrderDetail } from '../types/order.type';

const schema = new Schema({
   order: {
      type: Schema.Types.ObjectId,
      ref: 'Order',
   },
   product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
   },
   price: {
      type: Number,
      required: true,
   },
   size: {
      type: Number,
      required: true,
   },
   quantity: {
      type: Number,
      required: true,
   },
});

export default model<IOrderDetail>('OrderDetail', schema);
