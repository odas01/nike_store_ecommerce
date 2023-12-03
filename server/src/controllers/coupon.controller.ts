import { Request, Response } from 'express';

import Coupon from '../models/coupon.model';
import responseHandler from '../handlers/response.handler';
import Order from '../models/order.model';
import moment from 'moment';

export const create = async (req: Request, res: Response) => {
   try {
      const coupon = await Coupon.create(req.body);

      responseHandler.created(res, {
         coupon,
         message: {
            vi: 'Thêm phiếu giảm giá thành công',
            en: 'Successfully added coupon',
         },
      });
   } catch {
      responseHandler.error(res);
   }
};

export const getAll = async (req: Request, res: Response) => {
   const { name }: any = req.query;

   const skip = res.locals.skip || 0;
   const limit = res.locals.limit || 15;

   const filter = name
      ? {
           name: { $regex: new RegExp(String(name)), $options: 'i' },
        }
      : {};

   try {
      const total = await Coupon.countDocuments(filter);
      const page = skip / limit + 1 || 1;
      const lastPage = Math.ceil(total / limit) || 1;

      const coupons = await Coupon.find(filter)
         .lean()
         .sort({ createdAt: -1 })
         .skip(skip)
         .limit(limit);

      responseHandler.ok(res, { coupons, page, lastPage, total });
   } catch {
      responseHandler.error(res);
   }
};

export const updateOne = async (req: Request, res: Response) => {
   const id = req.params.id;
   try {
      const coupon = await Coupon.findByIdAndUpdate(id, req.body, {
         new: true,
      }).lean();
      responseHandler.ok(res, {
         coupon,
         message: {
            vi: 'Cập nhật phiếu giàm giá thành công',
            en: 'Successfully updated coupon',
         },
      });
   } catch {
      responseHandler.error(res);
   }
};

export const deleteOne = async (req: Request, res: Response) => {
   const id = req.params.id;
   try {
      const canDelete = await Order.find({ coupon: req.params.id }).lean();
      if (canDelete.length > 0) {
         return responseHandler.badrequest(res, {
            vi: 'Không thể xóa phiếu giảm giá đã sử dụng',
            en: 'Cannot delete coupon that already used',
         });
      }

      await Coupon.findByIdAndDelete(id).lean();
      responseHandler.ok(res, {
         message: {
            vi: 'Xóa phiếu giảm giá thành công',
            en: 'Successfully deleted coupon',
         },
      });
   } catch {
      responseHandler.error(res);
   }
};
export const checkOne = async (req: Request, res: Response) => {
   const code = req.params.id;
   const { _id } = res.locals.user;

   try {
      const coupon = await Coupon.findOne({ code });
      if (!coupon) {
         return responseHandler.badrequest(res, {
            vi: 'Mã giảm giá không tồn tại',
            en: 'Coupon does not exist',
         });
      }
      if (coupon) {
         if (moment().isAfter(coupon.expirationDate)) {
            return responseHandler.badrequest(res, {
               vi: 'Mã giảm giá quá hạn',
               en: 'Coupon has expired',
            });
         }
         if (coupon.quantity <= 0) {
            return responseHandler.badrequest(res, {
               vi: 'Mã giảm giá đã hết',
               en: 'Coupon has expired',
            });
         }

         const isUsed = await Order.findOne({
            user: _id,
            coupon: coupon._id,
         }).lean();
         if (isUsed) {
            return responseHandler.badrequest(res, {
               vi: 'Mã giảm giá đã được sử dụng',
               en: 'Coupon has been used',
            });
         }
      }

      responseHandler.ok(res, coupon);
   } catch {
      responseHandler.error(res);
   }
};
