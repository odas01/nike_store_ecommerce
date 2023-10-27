import { ObjectId } from 'mongoose';

export interface IMessage extends Document {
   message: string;
   users: ObjectId[];
   sender: ObjectId;
}
export interface IChat extends Document {
   members: ObjectId[];
   lastMessage: ObjectId;
}
