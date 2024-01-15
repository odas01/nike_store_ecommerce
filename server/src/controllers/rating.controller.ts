import { Request, Response } from 'express';

import Rating from '../models/rating.model';
import Order from '../models/order.model';
import responseHandler from '../handlers/response.handler';
import mongoose from 'mongoose';

export const create = async (req: Request, res: Response) => {
   try {
      const rating = await Rating.create(req.body);

      if (rating) {
         await Order.updateOne(
            {
               _id: req.body.order,
               products: { $elemMatch: { product: req.body.product } },
            },
            { 'products.$.isRating': true, 'products.$.rating': rating._id }
         );
      }
      responseHandler.created(res, rating);
   } catch {
      responseHandler.error(res);
   }
};

export const getAll = async (req: Request, res: Response) => {
   const { product }: any = req.query;

   const skip = res.locals.skip;
   const limit = res.locals.limit;

   try {
      const total = await Rating.countDocuments({
         product,
      });
      const page = skip / limit + 1 || 1;
      const lastPage = Math.ceil(total / limit) || 1;

      const ratings = await Rating.find({ product })
         .lean()
         .skip(skip)
         .limit(limit)
         .sort({ createdAt: -1 })
         .populate([
            {
               path: 'user',
               options: {
                  lean: true,
               },
               select: '-_id',
            },
            {
               path: 'product',
               options: {
                  lean: true,
               },
               select: '-_id',
            },
         ]);

      const rateCount = await Rating.aggregate([
         {
            $match: {
               product: new mongoose.Types.ObjectId(product),
            },
         },
         {
            $group: {
               _id: '$rate',
               count: { $sum: 1 },
            },
         },
         {
            $project: {
               _id: 0,
               rate: '$_id',
               count: 1,
            },
         },
         { $sort: { rate: 1 } },
      ]);

      responseHandler.ok(res, { ratings, page, lastPage, total, rateCount });
   } catch {
      responseHandler.error(res);
   }
};

export const updateOne = async (req: Request, res: Response) => {
   const id = req.params.id;
   try {
      const rating = await Rating.findByIdAndUpdate(id, req.body, {
         new: true,
      }).lean();
      responseHandler.ok(res, rating);
   } catch {
      responseHandler.error(res);
   }
};

export const deleteOne = async (req: Request, res: Response) => {
   const id = req.params.id;
   try {
      const rating = await Rating.findByIdAndDelete(id).lean();

      // if (rating) {
      //    await Order.updateOne(
      //       {
      //          _id: req.body.order,
      //          products: { $elemMatch: { product: rating.product } },
      //       },
      //       { 'products.$.isRating': false }
      //    );
      // }

      responseHandler.ok(res, rating);
   } catch {
      responseHandler.error(res);
   }
};
export const avg = async (req: Request, res: Response) => {
   const product = req.params.id;
   try {
      const length = await Rating.countDocuments({ product }).lean();

      const rateCount = await Rating.aggregate([
         {
            $match: {
               product: new mongoose.Types.ObjectId(product),
            },
         },
         {
            $group: {
               _id: '$rate',
               count: { $sum: 1 },
            },
         },
         {
            $project: {
               _id: 0,
               rate: '$_id',
               count: 1,
            },
         },
         { $sort: { rate: 1 } },
      ]);

      const avg =
         rateCount.length > 0
            ? (
                 rateCount.reduce(
                    (cur, item) => cur + item.rate * item.count,
                    0
                 ) / length
              ).toFixed(1)
            : 5;

      responseHandler.ok(res, {
         rateCount,
         avg,
         length,
      });
   } catch {
      responseHandler.error(res);
   }
};
