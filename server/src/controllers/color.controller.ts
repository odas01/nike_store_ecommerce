import { Request, Response } from 'express';

import Color from '../models/color.model';
import responseHandler from '../handlers/response.handler';
import Variant from '../models/variant.model';

export const create = async (req: Request, res: Response) => {
   try {
      const color = await Color.create(req.body);

      responseHandler.created(res, {
         color,
         message: {
            vi: 'Thêm màu sắc thành công',
            en: 'Successfully added color',
         },
      });
   } catch {
      responseHandler.error(res);
   }
};

export const getAll = async (req: Request, res: Response) => {
   const filter = req.query.name
      ? {
           $or: [
              {
                 name: {
                    $regex: new RegExp(String(req.query.name)),
                    $options: 'i',
                 },
              },
              {
                 vnName: {
                    $regex: new RegExp(String(req.query.name)),
                    $options: 'i',
                 },
              },
           ],
        }
      : {};

   const skip = res.locals.skip || 0;
   const limit = res.locals.limit || 15;

   try {
      const total = await Color.countDocuments(filter);
      const page = skip / limit + 1 || 1;
      const lastPage = Math.ceil(total / limit) || 1;

      const colors = await Color.find(filter)
         .lean()
         .sort({ createdAt: -1 })
         .skip(skip)
         .limit(limit);

      responseHandler.ok(res, { colors, page, lastPage, total });
   } catch {
      responseHandler.error(res);
   }
};

export const updateOne = async (req: Request, res: Response) => {
   const id = req.params.id;
   try {
      const color = await Color.findByIdAndUpdate(id, req.body, {
         new: true,
      }).lean();
      responseHandler.ok(res, {
         color,
         message: {
            vi: 'Cập nhật màu sắc thành công',
            en: 'Successfully updated color',
         },
      });
   } catch {
      responseHandler.error(res);
   }
};

export const deleteOne = async (req: Request, res: Response) => {
   const id = req.params.id;
   try {
      const canDelete = await Variant.find({ color: req.params.id }).lean();
      if (canDelete.length > 0) {
         return responseHandler.badrequest(res, {
            vi: 'Không thể xóa màu sắc đã sử dụng',
            en: 'Cannot delete colors that already used',
         });
      }

      await Color.findByIdAndDelete(id).lean();
      responseHandler.ok(res, {
         message: {
            vi: 'Xóa màu sắc thành công',
            en: 'Successfully deleted color',
         },
      });
   } catch {
      responseHandler.error(res);
   }
};
