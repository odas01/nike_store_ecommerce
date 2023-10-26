import { IUser } from '.';

export interface TokenUser {
   accessToken: string;
   refreshToken: string;
}
export interface AuthResponse {
   token: TokenUser;
   user: IUser;
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
