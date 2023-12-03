import Category from '../models/category.model';
import responseHandler from '../handlers/response.handler';

import { Request, Response } from 'express';
import Product from '../models/product.model';

export const create = async (req: Request, res: Response) => {
   try {
      const category = await Category.create(req.body);
      responseHandler.created(res, {
         category,
         message: {
            vi: 'Thêm danh mục thành công',
            en: 'Successfully added category',
         },
      });
   } catch {
      responseHandler.error(res);
   }
};

export const getAll = async (req: Request, res: Response) => {
   let filter = filterCategory(req.query.name as string);
   const skip = res.locals.skip;
   const limit = res.locals.limit;

   try {
      const total = await Category.countDocuments(filter);
      const page = skip / limit + 1 || 1;
      const lastPage = Math.ceil(total / limit) || 1;

      const categories = await Category.find(filter)
         .lean()
         .sort({ createdAt: -1 })
         .skip(skip)
         .limit(limit);

      responseHandler.ok(res, { categories, page, lastPage, total });
   } catch {
      responseHandler.error(res);
   }
};

const filterCategory = (name?: string) => {
   let filter = {};
   if (name) {
      filter = {
         $or: [
            {
               name: { $regex: new RegExp(name), $options: 'i' },
            },
            {
               vnName: { $regex: new RegExp(name), $options: 'i' },
            },
         ],
      };
   }

   return filter;
};

export const updateOne = async (req: Request, res: Response) => {
   try {
      const category = await Category.findOneAndUpdate(
         { _id: req.params.id },
         req.body
      ).lean();

      responseHandler.ok(res, {
         category,
         message: {
            vi: 'Cập nhật danh mục thành công',
            en: 'Successfully updated category',
         },
      });
   } catch {
      responseHandler.error(res);
   }
};

export const deleteOne = async (req: Request, res: Response) => {
   try {
      const canDelete = await Product.find({ category: req.params.id }).lean();
      if (canDelete.length > 0) {
         return responseHandler.badrequest(res, {
            vi: 'Không thể xóa danh mục đã có sản phẩm',
            en: 'Cannot delete categories that already have products',
         });
      }

      await Category.findByIdAndDelete(req.params.id);
      responseHandler.ok(res, {
         message: {
            vi: 'Xóa danh mục thành công',
            en: 'Successfully deleted category',
         },
      });
   } catch {
      responseHandler.error(res);
   }
};
