import Order from '../models/order.model';

import responseHandler from '../handlers/response.handler';
import { Request, Response } from 'express';
import CartItem from '../models/cartItem.model';
import Product from '../models/product.model';
import Variant from '../models/variant.model';
import { sendMailOrder } from '../config/sendMail';

export const create = async (req: Request, res: Response) => {
   const { _id, email } = res.locals.user;

   try {
      const order = await Order.create({ ...req.body, user: _id });
      await Promise.all([
         ...req.body.products.map(async (item: any) => {
            return Product.updateOne(
               { _id: item.product },
               { $inc: { sold: item.qty } }
            );
         }),
         ...req.body.products.map(async (item: any) => {
            return Variant.updateOne(
               {
                  _id: item.variant,
                  sizes: { $elemMatch: { size: item.size } },
               },
               { $inc: { 'sizes.$.stock': -item.qty } }
            );
         }),
      ]);
      await CartItem.deleteMany({ user: _id });
      await sendMailOrder(email);

      responseHandler.created(res, order);
   } catch {
      responseHandler.error(res);
   }
};

export const getAll = async (req: Request, res: Response) => {
   const { user } = req.query;
   const filter: any = {};
   if (user) {
      filter.user = user;
   }

   const skip = res.locals.skip;
   const limit = res.locals.limit;

   try {
      const total = await Order.countDocuments(filter);

      const page = Number(skip) / Number(limit) + 1 || 1;
      const lastPage = Math.ceil(total / Number(limit)) || 1;

      const orders = await Order.find(filter)
         .lean()
         .sort({ createdAt: -1 })
         .skip(Number(skip))
         .limit(Number(limit))
         .populate([
            {
               path: 'user',
               options: {
                  lean: true,
               },
               select: '-_id name email phone role status',
            },
            {
               path: 'products.product',
               options: {
                  lean: true,
               },
               select: '-_id name slug',
            },
            {
               path: 'products.variant',
               options: {
                  lean: true,
               },
               populate: {
                  path: 'color',
                  options: {
                     lean: true,
                  },
                  select: '-_id name value',
               },
               select: '-_id color',
            },
         ]);
      responseHandler.ok(res, { page, lastPage, orders, total });
   } catch (err) {
      responseHandler.error(res);
   }
};

export const updateOne = async (req: Request, res: Response) => {
   const id = req.params.id;

   try {
      await Order.findByIdAndUpdate(id, req.body);

      responseHandler.created(res, {});
   } catch {
      responseHandler.error(res);
   }
};
