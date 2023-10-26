import { Request, Response } from 'express';

import Color from '../models/color.model';
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
   const filter = req.query.name
      ? {
           name: { $regex: new RegExp(String(req.query.name)), $options: 'i' },
        }
      : {};

   const skip = res.locals.skip;
   const limit = res.locals.limit;

   try {
      const total = await Color.countDocuments(filter);
      const page = skip / limit + 1 || 1;
      const lastPage = Math.ceil(total / limit) || 1;

      const colors = await Color.find(filter)
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
      responseHandler.ok(res, color);
   } catch {
      responseHandler.error(res);
   }
};
