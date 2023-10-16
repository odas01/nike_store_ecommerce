import Category from '../models/Category';
import responseHandler from '../handlers/response.handler';

import { Request, Response } from 'express';

export const create = async (req: Request, res: Response) => {
   try {
      const isExist = await Category.findOne({
         name: req.body.name,
         parentCate: req.body.parentCate,
      });

      if (isExist)
         return responseHandler.badrequest(res, 'Category already exist');

      const category = await Category.create(req.body);

      responseHandler.created(res, { category });
   } catch {
      responseHandler.error(res);
   }
};

export const getAll = async (req: Request, res: Response) => {
   let filter = filterCategory(req.query);
   const { skip, limit }: any = req.query;

   try {
      if (skip && limit) {
         const total = await Category.countDocuments(filter);
         const page = skip / limit + 1 || 1;
         const lastPage = Math.ceil(total / limit) || 1;

         const categories = await Category.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

         responseHandler.ok(res, { categories, page, lastPage, total });
      } else {
         const categories = await Category.find(filter);
         responseHandler.ok(res, { categories, total: categories.length });
      }
   } catch {
      responseHandler.error(res);
   }
};

const filterCategory = (value: any) => {
   let filter = {
      ...value,
      name: { $regex: new RegExp(String(value.name)), $options: 'i' },
   };

   !value.name && delete filter.name;
   !value.parentCate && delete filter.parentCate;
   delete filter.skip;
   delete filter.limit;

   return filter;
};

export const updateOne = async (req: Request, res: Response) => {
   try {
      const category = await Category.findOneAndUpdate(
         { _id: req.params.id },
         req.body
      );

      responseHandler.ok(res, {
         category,
      });
   } catch {
      responseHandler.error(res);
   }
};

export const deleteOne = async (req: Request, res: Response) => {
   try {
      Category.findByIdAndDelete(req.params.id)
         .then(() =>
            responseHandler.ok(res, { msg: 'Delete category successfully' })
         )
         .catch(() => responseHandler.notfound(res));
   } catch {
      responseHandler.error(res);
   }
};

export const search = async (req: Request, res: Response) => {
   const value = req.query.q;
   try {
      if (value) {
         const categories = await Category.find({
            name: { $regex: new RegExp(value.toString()), $options: 'i' },
         }).sort({ _id: 1 });
         responseHandler.ok(res, { categories });
      }
      return responseHandler.badrequest(res, 'No search value');
   } catch {
      responseHandler.error(res);
   }
};
