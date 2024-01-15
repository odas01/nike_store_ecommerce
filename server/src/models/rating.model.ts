import { model, Schema } from 'mongoose';

const schema = new Schema(
   {
      product: {
         type: Schema.Types.ObjectId,
         ref: 'Product',
         required: true,
      },
      user: {
         type: Schema.Types.ObjectId,
         ref: 'User',
         required: true,
      },
      order: {
         type: Schema.Types.ObjectId,
         ref: 'Order',
         required: true,
      },
      rate: {
         type: Number,
         min: 0,
         max: 5,
         default: 5,
      },
      comment: {
         type: String,
         default: '',
      },
      isShow: {
         type: Boolean,
         default: true,
      },
   },
   { timestamps: true }
);

export default model('Rating', schema);
