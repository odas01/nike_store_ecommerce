import mongoose from 'mongoose';
import { IChat } from '../types/message.type';

const messageSchema = new mongoose.Schema<IChat>(
   {
      members: [
         {
            type: mongoose.Schema.Types.ObjectId,
            red: 'User',
         },
      ],
      lastMessage: {
         type: mongoose.Schema.Types.ObjectId,
         red: 'User',
      },
   },
   { timestamps: true }
);

export default mongoose.model<IChat>('Chat', messageSchema);
