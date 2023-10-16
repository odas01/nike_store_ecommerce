import { Request, Response } from 'express';

import Coupon from '../models/Coupon';
import responseHandler from '../handlers/response.handler';

export const create = async (req: Request, res: Response) => {
   try {
      const coupon = await Coupon.create(req.body);

      responseHandler.created(res, coupon);
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
         const total = await Coupon.countDocuments(filter);
         const page = skip / limit + 1 || 1;
         const lastPage = Math.ceil(total / limit) || 1;

         const coupons = await Coupon.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

         responseHandler.ok(res, { coupons, page, lastPage, total });
      } else {
         const coupons = await Coupon.find({});
         responseHandler.ok(res, { coupons, total: coupons.length });
      }
   } catch {
      responseHandler.error(res);
   }
};

export const updateOne = async (req: Request, res: Response) => {
   const id = req.params.id;
   try {
      const coupon = await Coupon.findByIdAndUpdate(id, req.body, {
         new: true,
      });
      responseHandler.ok(res, coupon);
   } catch {
      responseHandler.error(res);
   }
};

export const deleteOne = async (req: Request, res: Response) => {
   const id = req.params.id;
   try {
      const coupon = await Coupon.findByIdAndDelete(id);
      setTimeout(() => {
         responseHandler.ok(res, coupon);
      }, 2000);
   } catch {
      responseHandler.error(res);
   }
};
export const checkOne = async (req: Request, res: Response) => {
   const code = req.params.id;
   try {
      const coupon = await Coupon.findOne({ code });
      if (!coupon) {
         return responseHandler.badrequest(res, 'Coupon does not exist');
      }
      responseHandler.ok(res, coupon);
   } catch {
      responseHandler.error(res);
   }
};
