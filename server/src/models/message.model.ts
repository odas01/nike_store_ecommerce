import mongoose from 'mongoose';
import { IMessage } from '../types/message.type';

const messageSchema = new mongoose.Schema<IMessage>(
   {
      message: {
         type: String,
      },
      users: [
         {
            type: mongoose.Schema.Types.ObjectId,
            red: 'User',
         },
      ],
      sender: {
         type: mongoose.Schema.Types.ObjectId,
         red: 'User',
      },
   },
   { timestamps: true }
);

export default mongoose.model<IMessage>('Message', messageSchema);
