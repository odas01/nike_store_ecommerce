import { Image, ListWithParams, Message } from '.';

export interface IUser {
   _id: string;
   role: string;
   name: string;
   email: string;
   phone: string;
   address: string;
   avatar: Image;
   status: string;
   createdAt: Date;
}

export interface AllUsers extends ListWithParams {
   users: IUser[];
}

export type UserFormUpdate = Partial<Omit<IUser, 'avatar'>> & {
   avatar?: string;
};

export interface UserResponse {
   user: IUser;
   message: Message;
}

export interface UserCount {
   role: string;
   count: number;
}
