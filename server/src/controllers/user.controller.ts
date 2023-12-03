import { NextFunction, Request, Response } from 'express';

import User from '../models/user.model';
import responseHandler from '../handlers/response.handler';
import { uploadSingle, destroySingle } from '../middleware/images.middleware';

const filterUser = (query: any): any => {
   const { role, search } = query;
   let filter: any = {};
   if (role) filter.role = role;
   if (search)
      filter = {
         ...filter,
         $or: [
            { name: { $regex: new RegExp(search), $options: 'i' } },
            { phone: { $regex: new RegExp(search), $options: 'i' } },
            { email: { $regex: new RegExp(search), $options: 'i' } },
         ],
      };
   filter.status = {
      $ne: 'deleted',
   };

   return filter;
};

export const getAll = async (req: Request, res: Response) => {
   const { role }: any = req.query;
   const filter = filterUser(req.query);

   const skip = res.locals.skip;
   const limit = res.locals.limit;

   try {
      const total = await User.countDocuments(role ? { role } : {});

      const page = skip / limit + 1 || 1;
      const lastPage = Math.ceil(total / limit) || 1;

      const users = await User.find(filter)
         .lean()
         .sort({ createdAt: -1 })
         .skip(skip)
         .limit(limit);

      responseHandler.ok(res, { users, page, lastPage, total });
   } catch {
      responseHandler.error(res);
   }
};

export const getOne = async (req: Request, res: Response) => {
   try {
      const user = await User.findById(req.params.id)
         .lean()
         .select('-password');

      if (!user) return responseHandler.notfound(res);

      responseHandler.ok(res, user);
   } catch {
      responseHandler.error(res);
   }
};

export const updateOne = async (req: Request, res: Response) => {
   const { role, email, avatar, ...values } = req.body;
   const currentUser = res.locals.user;

   try {
      const foundUser = await User.findOne({
         _id: { $ne: req.params.id },
         email,
         role,
      }).lean();

      if (foundUser) {
         return responseHandler.badrequest(res, {
            vi: 'Email đã tồn tại',
            en: 'Email already exists',
         });
      }

      if (avatar && avatar.slice(0, 4) !== 'http') {
         if (currentUser.avatar) {
            await destroySingle(currentUser.avatar.public_id);
         }
         values.avatar = await uploadSingle(avatar, 'account');
      }
      const user = await User.findByIdAndUpdate(
         req.params.id,
         {
            ...values,
            email,
         },
         { new: true }
      ).lean();

      responseHandler.ok(res, {
         user,
         message: {
            vi: 'Cập nhật thông tin thành công',
            en: 'Successfully updated information',
         },
      });
   } catch {
      responseHandler.error(res);
   }
};

export const deleteOne = async (req: Request, res: Response) => {
   try {
      await User.findByIdAndUpdate(req.params.id, { status: 'deleted' }).lean();

      responseHandler.ok(res, {
         message: {
            vi: 'Xóa người dùng thành công',
            en: 'Successfully deleted user',
         },
      });
   } catch {
      responseHandler.error(res);
   }
};

export const count = async (req: Request, res: Response) => {
   try {
      const count = await User.aggregate([
         {
            $group: {
               _id: '$role',
               count: { $sum: 1 },
            },
         },
         {
            $project: {
               _id: 0,
               role: '$_id',
               count: 1,
            },
         },
      ]);
      responseHandler.ok(res, count);
   } catch {
      responseHandler.error(res);
   }
};
