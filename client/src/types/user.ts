import { Image } from '.';
import { ListWithParams } from './listWithParams';

export interface TokenUser {
   accessToken: string;
   refreshToken: string;
}

export interface IUser {
   _id: string;
   role: string;
   name: string;
   email: string;
   phone: string;
   address: string;
   avatar: Image;
   status: 'active' | 'blocked' | 'deleted';
   createdAt: Date;
}

export interface AllUsers extends ListWithParams {
   users: IUser[];
}

export type UserFormUpdate = Partial<IUser>;
