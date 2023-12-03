import jsonwebtoken from 'jsonwebtoken';
import User from '../models/user.model';
import { IUser } from '../types/user.type';

import responseHandler from '../handlers/response.handler';
import { NextFunction, Request, Response } from 'express';

const tokenDecode = async (req: Request) => {
   const bearerHeader = req.headers['authorization'];

   if (bearerHeader) {
      const bearer = bearerHeader.split(' ')[1];

      try {
         const tokenDecoded = jsonwebtoken.verify(
            bearer,
            process.env.JWT_ACCESS_KEY || 'access_key'
         );

         return tokenDecoded;
      } catch {
         return false;
      }
   } else {
      return false;
   }
};

export const checkAuth = async (
   req: Request,
   res: Response,
   next: NextFunction
) => {
   const tokenDecoded: any = await tokenDecode(req);

   if (tokenDecoded) {
      const user = await User.findById(tokenDecoded.id).lean();

      if (!user) return responseHandler.unauthorize(res);

      res.locals.user = user;
      next();
   } else return responseHandler.unauthorize(res);
};

export const verifyAdminRoot = async (
   req: Request,
   res: Response,
   next: NextFunction
) => {
   const role: string = res.locals.user.role;

   if (role === 'customer') return responseHandler.unauthorize(res);

   next();
};

export const verifyRoot = async (
   req: Request,
   res: Response,
   next: NextFunction
) => {
   const role: string = res.locals.user.role;

   if (role === 'customer' || role === 'admin')
      return responseHandler.unauthorize(res);

   next();
};
