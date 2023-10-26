import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import User from '../models/user.model';
import responseHandler from '../handlers/response.handler';
// import sendMail from '../config/sendMail';
import { Request, Response } from 'express';
import axios from 'axios';
import { sendMailForgotPassword } from '../config/sendMail';
import { IUser } from '../types/user.type';

const generateTokens = (payload: any) => {
   const accessToken = jwt.sign(
      payload,
      process.env.JWT_ACCESS_KEY || 'access_key',
      {
         expiresIn: '30s',
      }
   );

   const refreshToken = jwt.sign(
      payload,
      process.env.JWT_REFRESH_KEY || 'refresh_key',
      {
         expiresIn: '30d',
      }
   );

   return { accessToken, refreshToken };
};

// register
export const signup = async (req: Request, res: Response) => {
   try {
      const foundUser = await User.findOne({
         email: req.body.email,
         role: 'customer',
      });

      // check account exists
      if (foundUser)
         return responseHandler.badrequest(res, 'Email is already in use.');

      // resgis success
      const user = await User.create(req.body);

      responseHandler.created(res, user);
   } catch {
      responseHandler.error(res);
   }
};

// login
export const login = async (req: Request, res: Response) => {
   try {
      const user = await User.findOne({
         email: req.body.email,
         role: 'customer',
      });

      // check account exists
      if (!user)
         return responseHandler.badrequest(res, 'Incorret email or password');

      // check password
      const passwordValid = bcrypt.compareSync(
         req.body.password,
         user.password!
      );
      if (!passwordValid)
         return responseHandler.badrequest(res, 'Incorret password');

      // login success
      const token = generateTokens({ id: user.id });
      responseHandler.ok(res, {
         token,
         user,
      });
   } catch {
      responseHandler.error(res);
   }
};

// admin signup
export const adminSignup = async (req: Request, res: Response) => {
   try {
      const user = await User.findOne({ email: req.body.email });

      // check account exists
      if (user)
         return responseHandler.badrequest(res, 'Email is already in use.');

      // resgis success
      const newUser = await User.create({ ...req.body, role: 'admin' });

      responseHandler.created(res, {
         user: newUser,
         message: 'Account successfully created',
      });
   } catch {
      responseHandler.error(res);
   }
};

// admin login
export const adminLogin = async (req: Request, res: Response) => {
   try {
      const user = await User.findOne({
         email: req.body.email,
         role: ['admin', 'root'],
      });

      // check account exists
      if (!user) return responseHandler.badrequest(res, 'Email does not exist');

      // check password
      const passwordValid = bcrypt.compareSync(
         req.body.password,
         user?.password!
      );
      if (!passwordValid)
         return responseHandler.badrequest(res, 'Incorret password');

      // login
      const token = generateTokens({ id: user.id });
      responseHandler.ok(res, {
         token,
         user,
      });
   } catch {
      responseHandler.error(res);
   }
};

export const googleLogin = async (req: Request, res: Response) => {
   const bearerHeader = req.headers['authorization'];
   const accessToken = bearerHeader?.split(' ')[1];

   axios
      .get('https://www.googleapis.com/oauth2/v3/userinfo', {
         headers: {
            Authorization: `Bearer ${accessToken}`,
         },
      })
      .then(async ({ data }) => {
         const user = await User.findOne({ email: data.email });
         if (user) {
            const token = generateTokens({ id: user.id });
            responseHandler.ok(res, { token, user });
         } else {
            // resgis success
            const newUser = await User.create({
               name: data.name,
               email: data.email,
               avatar: {
                  public_id: '',
                  url: data.picture,
               },
            });
            const token = generateTokens({ id: newUser.id });
            responseHandler.ok(res, { token, user: newUser });
         }
      })
      .catch((err) => {
         responseHandler.badrequest(res, 'Invalid access token!');
      });
};

// refresh token
export const refreshToken = async (req: Request, res: Response) => {
   const refreshToken = req.body.token;
   if (!refreshToken) {
      responseHandler.unauthorize(res);
   }

   jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_KEY || 'refresh_key',
      (err: any, user: any) => {
         if (err) return responseHandler.unauthorize(res);
         // create new token
         const newToken = generateTokens({ id: user.id });

         responseHandler.ok(res, { ...newToken });
      }
   );
};

export const authChecker = async (req: Request, res: Response) => {
   const user = res.locals.user;
   responseHandler.ok(res, {
      user,
      role: user.role,
   });
};

export const changePassword = async (req: Request, res: Response) => {
   const currentUser = res.locals.user;
   const { currentPass, newPass } = req.body;

   const passwordValid = bcrypt.compareSync(currentPass, currentUser.password);

   if (!passwordValid)
      return responseHandler.badrequest(res, 'Current password is incorrect');

   const salt = await bcrypt.genSalt(10);
   const password = await bcrypt.hash(newPass, salt);
   const user = await User.findByIdAndUpdate(
      currentUser._id,
      { password },
      { new: true }
   );

   responseHandler.ok(res, user);
};
export const forgotPassword = async (req: Request, res: Response) => {
   const { email } = req.body;
   if (!email) {
      return responseHandler.badrequest(res, 'Missing email');
   }
   const foundUser = await User.findOne({ email });
   if (!foundUser) {
      return responseHandler.badrequest(res, 'User not existed');
   }
   const token = jwt.sign(
      { id: foundUser._id },
      process.env.JWT_FORGOT_KEY || 'key',
      { expiresIn: '1d' }
   );

   await sendMailForgotPassword(email, foundUser._id, token);

   responseHandler.ok(res, {});
};
export const resetPassword = async (req: Request, res: Response) => {
   const { id, token } = req.params;
   const { password } = req.body;

   jwt.verify(token, process.env.JWT_FORGOT_KEY || 'key', async (err: any) => {
      if (err) return responseHandler.badrequest(res, 'Error with token');

      // create new token

      const salt = await bcrypt.genSalt(10);
      const newPassword = await bcrypt.hash(password, salt);

      const user = await User.findByIdAndUpdate(
         id,
         { password: newPassword },
         { new: true }
      );

      responseHandler.ok(res, user);
   });
};
