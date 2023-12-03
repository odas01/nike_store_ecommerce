import { Request, Response } from 'express';

import Size from '../models/size.model';
import responseHandler from '../handlers/response.handler';

export const create = async (req: Request, res: Response) => {
   try {
      const size = await Size.create(req.body);
      responseHandler.created(res, {
         size,
         message: {
            vi: 'Thêm kích thước thành công',
            en: 'Successfully added size',
         },
      });
   } catch {
      responseHandler.error(res);
   }
};

export const getAll = async (req: Request, res: Response) => {
   const { name }: any = req.query;
   const filter = name
      ? {
           name: { $regex: new RegExp(String(name)), $options: 'i' },
        }
      : {};

   const skip = res.locals.skip;
   const limit = res.locals.limit;

   try {
      const total = await Size.countDocuments(filter);
      const page = skip / limit + 1 || 1;
      const lastPage = Math.ceil(total / limit) || 1;

      const sizes = await Size.find(filter)
         .lean()
         .sort({ createdAt: -1 })
         .skip(skip)
         .limit(limit);

      responseHandler.ok(res, { sizes, page, lastPage, total });
   } catch {
      responseHandler.error(res);
   }
};

export const updateOne = async (req: Request, res: Response) => {
   const id = req.params.id;
   try {
      const size = await Size.findByIdAndUpdate(id, req.body).lean();
      responseHandler.created(res, {
         size,
         message: {
            vi: 'Cập nhật kích thước thành công',
            en: 'Successfully updated size',
         },
      });
   } catch {
      responseHandler.error(res);
   }
};

export const deleteOne = async (req: Request, res: Response) => {
   const id = req.params.id;
   try {
      await Size.findByIdAndDelete(id).lean();
      responseHandler.created(res, {
         message: {
            vi: 'Xóa kích thước thành công',
            en: 'Successfully deleted size',
         },
      });
   } catch {
      responseHandler.error(res);
   }
};
