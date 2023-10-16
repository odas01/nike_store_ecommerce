import Order from '../models/Order';

import responseHandler from '../handlers/response.handler';
import { Request, Response } from 'express';
import CartItem from '../models/CartItem';
import Product from '../models/Product';
import Variant from '../models/Variant';

export const getOne = async (req: Request, res: Response) => {
   // try {
   //    await Order.findById(req.params.id).then(async (order) => {
   //       order._doc.details = await OrderDetail.find({ order: order._id })
   //          .sort({ product: 1, size: 1 })
   //          .populate('product', 'title thumbnail price');
   //       responseHandler.ok(res, { order });
   //    });
   // } catch {
   //    responseHandler.error(res);
   // }
};

export const getByUser = async (req: Request, res: Response) => {
   // try {
   //    await Order.find({ user: req.params.userId }).then(async (orders) => {
   //       for await (let order of orders) {
   //          const orderDetails = await OrderDetail.find({
   //             order: order._id,
   //          }).populate('product', 'title thumbnail price');
   //          order.details = orderDetails;
   //       }
   //       responseHandler.ok(res, { orders, total: orders.length });
   //    });
   // } catch {
   //    responseHandler.error(res);
   // }
};

export const create = async (req: Request, res: Response) => {
   const { _id } = res.locals.user;

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

      responseHandler.created(res, order);
   } catch {
      responseHandler.error(res);
   }
};

export const getAll = async (req: Request, res: Response) => {
   const { skip, limit } = req.query;
   try {
      const total = await Order.countDocuments({});

      const page = Number(skip) / Number(limit) + 1 || 1;
      const lastPage = Math.ceil(total / Number(limit)) || 1;

      const orders = await Order.find({})
         .lean()
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
