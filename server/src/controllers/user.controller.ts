import { NextFunction, Request, Response } from 'express';

import User from '../models/User';
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
   return filter;
};

export const getAll = async (req: Request, res: Response) => {
   const { skip, limit, role }: any = req.query;
   const filter = filterUser(req.query);
   console.log(filter);

   try {
      const total = await User.countDocuments(role ? { role } : {});

      const page = skip / limit + 1 || 1;
      const lastPage = Math.ceil(total / limit) || 1;

      const users = await User.find(filter)
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
      const user = await User.findById(req.params.id);

      if (!user) return responseHandler.notfound(res);

      responseHandler.ok(res, user);
   } catch {
      responseHandler.error(res);
   }
};

export const updateOne = async (req: Request, res: Response) => {
   const values = req.body;
   try {
      const currentUser: any = await User.findById(req.params.id);
      if (values.avatar) {
         if (currentUser.avatar.public_id) {
            await destroySingle(currentUser.avatar?.public_id);
         }
         const avatarRes: any = await uploadSingle(values.avatar);
         values.avatar = {
            public_id: avatarRes.public_id,
            url: avatarRes.url,
         };
      }

      User.findByIdAndUpdate(req.params.id, values, {
         new: true,
         update: true,
      })
         .select('-password ')
         .then((user) => responseHandler.ok(res, user));
   } catch {
      responseHandler.error(res);
   }
};

export const deleteOne = async (req: Request, res: Response) => {
   try {
      await User.findByIdAndUpdate(req.params.id, { deleted: true });
      responseHandler.ok(res, {});
   } catch {
      responseHandler.error(res);
   }
};

export const blockOne = async (req: Request, res: Response) => {
   responseHandler.ok(res, { msg: '123' });
};
