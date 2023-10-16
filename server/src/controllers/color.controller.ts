import { Request, Response } from 'express';

import Color from '../models/Color';
import responseHandler from '../handlers/response.handler';

export const create = async (req: Request, res: Response) => {
   try {
      const color = await Color.create(req.body);

      responseHandler.created(res, color);
   } catch {
      responseHandler.error(res);
   }
};

export const getAll = async (req: Request, res: Response) => {
   const { skip, limit, name }: any = req.query;
   const filter = name
      ? {
           name: { $regex: new RegExp(String(name)), $options: 'i' },
        }
      : {};

   try {
      if (skip && limit) {
         const total = await Color.countDocuments(filter);
         const page = skip / limit + 1 || 1;
         const lastPage = Math.ceil(total / limit) || 1;

         const colors = await Color.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

         responseHandler.ok(res, { colors, page, lastPage, total });
      } else {
         const colors = await Color.find({});
         const newColor = colors.map((item: any) => {
            item.giagiam = 1;
            return { ...item._doc, giagiam: 1 };
         });
         console.log(newColor);
         responseHandler.ok(res, { colors, total: colors.length });
      }
   } catch {
      responseHandler.error(res);
   }
};

export const updateOne = async (req: Request, res: Response) => {
   const id = req.params.id;
   try {
      const color = await Color.findByIdAndUpdate(id, req.body, { new: true });
      responseHandler.ok(res, color);
   } catch {
      responseHandler.error(res);
   }
};

export const deleteOne = async (req: Request, res: Response) => {
   const id = req.params.id;
   try {
      const color = await Color.findByIdAndDelete(id);
      setTimeout(() => {
         responseHandler.ok(res, color);
      }, 2000);
   } catch {
      responseHandler.error(res);
   }
};
