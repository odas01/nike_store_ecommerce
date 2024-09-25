import axios from 'axios';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';

import User from '../models/user.model';
import responseHandler from '../handlers/response.handler';
import { sendMailForgotPassword } from '../config/sendMail';

const generateTokens = (payload: any) => {
   const accessToken = jwt.sign(
      payload,
      process.env.JWT_ACCESS_KEY || 'access_key',
      {
         expiresIn: '1d',
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
      }).lean();

      // check account exists
      if (foundUser)
         return responseHandler.badrequest(res, {
            vi: 'Email đã tồn tại',
            en: 'Email is already in use',
         });

      // resgis success
      const user = await User.create(req.body);

      responseHandler.created(res, {
         user,
         message: {
            vi: 'Đăng kí thành công',
            en: 'Successfully registered account',
         },
      });
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
      }).lean();

      // check account exists
      if (!user)
         return responseHandler.badrequest(res, {
            vi: 'Tài khoản không tồn tại',
            en: 'Email does not exist',
         });

      if (user.status === 'blocked')
         return responseHandler.badrequest(res, {
            vi: 'Tài khoản của bạn đã bị khóa',
            en: 'Your account has been blocked',
         });

      // check password
      const passwordValid = bcrypt.compareSync(
         req.body.password,
         user.password!
      );

      if (!passwordValid)
         return responseHandler.badrequest(res, {
            vi: 'Sai mật khẩu',
            en: 'Incorret password',
         });

      // login success
      const token = generateTokens({ id: user._id });
      responseHandler.ok(res, {
         token,
         user,
         message: {
            vi: `Chào mừng ${user.name} đến với Nike Store`,
            en: `Welcome ${user.name} to Nike Store`,
         },
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
         return responseHandler.badrequest(res, {
            vi: 'Email đã tồn tại',
            en: 'Email is already in use',
         });

      // resgis success
      const newUser = await User.create({ ...req.body, role: 'admin' });

      responseHandler.created(res, {
         user: newUser,
         message: {
            vi: 'Tạo tài khoản thành công',
            en: 'Successfully created acount',
         },
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
      }).lean();

      // check account exists
      if (!user)
         return responseHandler.badrequest(res, {
            vi: 'Tài khoản không tồn tại',
            en: 'Email does not exist',
         });

      // check password
      const passwordValid = bcrypt.compareSync(
         req.body.password,
         user?.password!
      );
      if (!passwordValid)
         return responseHandler.badrequest(res, {
            vi: 'Sai mật khẩu',
            en: 'Incorret password',
         });

      // login
      const token = generateTokens({ id: user._id });
      responseHandler.ok(res, {
         token,
         user,
         message: {
            vi: `Đăng nhập quản trị viên thành công`,
            en: `Admin login successful`,
         },
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
            const token = generateTokens({ id: user._id });
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
            const token = generateTokens({ id: newUser._id });
            responseHandler.ok(res, { token, user: newUser });
         }
      })
      .catch(() => {
         responseHandler.badrequest(res, {
            vi: 'Sai token!',
            en: 'Invalid access token!',
         });
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
      return responseHandler.badrequest(res, {
         vi: 'Mật khẩu hiện tại sai',
         en: 'Current password is wrong',
      });

   const salt = await bcrypt.genSalt(10);
   const password = await bcrypt.hash(newPass, salt);
   await User.findByIdAndUpdate(
      currentUser._id,
      { password },
      { new: true }
   ).lean();

   responseHandler.ok(res, {
      message: {
         vi: 'Đổi mật khẩu thành công',
         en: 'Changed password successfully',
      },
   });
};

export const adminChangePassword = async (req: Request, res: Response) => {
   const { userId, newPassword } = req.body;

   const salt = await bcrypt.genSalt(10);
   const password = await bcrypt.hash(newPassword, salt);

   await User.findByIdAndUpdate(userId, { password }, { new: true }).lean();

   responseHandler.ok(res, {
      message: {
         vi: 'Đổi mật khẩu thành công',
         en: 'Changed password successfully',
      },
   });
};
export const forgotPassword = async (req: Request, res: Response) => {
   const { email } = req.body;
   if (!email) {
      return responseHandler.badrequest(res, {
         vi: 'Thiếu email',
         en: "'Missing email'",
      });
   }

   const foundUser = await User.findOne({ email }).lean();
   if (!foundUser) {
      return responseHandler.badrequest(res, {
         vi: 'Tài khoản không tồn tại',
         en: 'Email does not exist',
      });
   }

   const token = jwt.sign(
      { id: foundUser._id },
      process.env.JWT_FORGOT_KEY || 'key',
      { expiresIn: '1d' }
   );

   await sendMailForgotPassword(email, foundUser._id, token);

   responseHandler.ok(res, {
      message: {
         vi: 'Kiểm tra email của bạn',
         en: 'Check your email',
      },
   });
};
export const resetPassword = async (req: Request, res: Response) => {
   const { id, token } = req.params;
   const { password } = req.body;

   jwt.verify(token, process.env.JWT_FORGOT_KEY || 'key', async (err: any) => {
      if (err)
         return responseHandler.badrequest(res, {
            vi: 'Sai token',
            en: 'Invalid access token!',
         });

      // create new token
      const salt = await bcrypt.genSalt(10);
      const newPassword = await bcrypt.hash(password, salt);

      const user = await User.findByIdAndUpdate(
         id,
         { password: newPassword },
         { new: true }
      ).lean();

      responseHandler.ok(res, {
         message: {
            vi: 'Đặt lại mật khẩu thành công',
            en: 'Reset the password successfully',
         },
      });
   });
};
