import { model, Schema } from 'mongoose';
import bcrypt from 'bcrypt';

import { IUser } from '../types/user.type';

const schema = new Schema(
   {
      name: {
         type: String,
         trim: true,
         required: true,
      },
      email: {
         type: String,
         unique: true,
         trim: true,
         required: true,
      },
      password: {
         type: String,
         trim: true,
      },
      phone: {
         type: String,
         trim: true,
      },
      address: {
         type: String,
         trim: true,
      },
      avatar: {
         public_id: {
            type: String,
         },
         url: {
            type: String,
         },
      },
      role: {
         type: String,
         enum: ['root', 'admin', 'customer'],
         default: 'customer',
      },
      status: {
         type: String,
         enum: ['active', 'blocked', 'deleted'],
         default: 'active',
      },
   },
   {
      toJSON: {
         transform: (_, obj) => {
            delete obj.password;
            delete obj.__v;
         },
      },
      timestamps: true,
   }
);

schema.pre('save', async function (next) {
   const salt = await bcrypt.genSalt(10);

   if (this.password) {
      this.password = await bcrypt.hash(this.password, salt);
   }
   next();
});

export default model<IUser>('User', schema);
