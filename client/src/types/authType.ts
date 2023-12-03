import { IUser, Message } from '.';

export interface TokenUser {
   accessToken: string;
   refreshToken: string;
}

export interface AuthResponse {
   token: TokenUser;
   user: IUser;
   message: Message;
}

export interface LoginResponse {
   token: TokenUser;
   user: IUser;
   message: Message;
}
export interface SignupResponse {
   user: IUser;
   message: Message;
}

export interface AuthCheckResponse {
   user: IUser;
   role: string;
}

export interface ILogin {
   email: string;
   password: string;
}

export interface ISignUp {
   name: string;
   email: string;
   password: string;
}

export interface ChangePass {
   currentPass: string;
   newPass: string;
}
