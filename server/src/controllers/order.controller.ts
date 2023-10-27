import Order from '../models/order.model';

import responseHandler from '../handlers/response.handler';
import { Request, Response } from 'express';
import CartItem from '../models/cartItem.model';
import Product from '../models/product.model';
import Variant from '../models/variant.model';
import { sendMailOrder } from '../config/sendMail';
import moment from 'moment';

const filterOrder = (query: any) => {
   const { search, paymentMethod, status, user } = query;
   let filter: any = {};
   if (search)
      filter = {
         ...filter,
         $or: [{ phone: { $regex: new RegExp(search), $options: 'i' } }],
      };
   if (paymentMethod) {
      filter.paymentMethod = paymentMethod;
   }
   if (status) {
      filter.status = status;
   }
   if (user) {
      filter.user = user;
   }
   return filter;
};

const sortOrder = (query: any) => {
   let sort = {};
   if (query.sort) {
      const [key, value] = String(query.sort).split(':');

      sort = {
         [key]: Number(value),
      };
   } else {
      sort = {
         createdAt: -1,
      };
   }
   return sort;
};

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
   const filter = filterOrder(req.query);
   const sort = sortOrder(req.query);

   const skip = res.locals.skip;
   const limit = res.locals.limit;

   try {
      const total = await Order.countDocuments(filter);

      const page = Number(skip) / Number(limit) + 1 || 1;
      const lastPage = Math.ceil(total / Number(limit)) || 1;

      const orders = await Order.find(filter)
         .lean()
         .sort(sort)
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

export const dashboardCount = async (req: Request, res: Response) => {
   try {
      const orders = await Order.aggregate([
         {
            $group: {
               _id: '$status',
               count: { $sum: 1 },
            },
         },
         {
            $project: {
               _id: 0,
               status: '$_id',
               count: 1,
            },
         },
      ]);
      responseHandler.ok(res, { orders });
   } catch {
      responseHandler.error(res);
   }
};

export const dashboardAmount = async (req: Request, res: Response) => {
   try {
      const toDayOrder = await Order.aggregate([
         {
            $match: {
               createdAt: {
                  $gte: new Date(moment().startOf('day').toDate()),
                  $lt: new Date(),
               },
               paid: true,
            },
         },
         {
            $group: {
               _id: '$paymentMethod',
               total: { $sum: '$total' },
            },
         },
         {
            $project: {
               _id: 0,
               method: '$_id',
               total: 1,
            },
         },
         {
            $sort: { method: 1 },
         },
      ]);
      const yesterdayOrder = await Order.aggregate([
         {
            $match: {
               createdAt: {
                  $gte: new Date(
                     moment().add(-1, 'day').startOf('day').toDate()
                  ),
                  $lt: new Date(moment().add(-1, 'day').endOf('day').toDate()),
               },
               paid: true,
            },
         },
         {
            $group: {
               _id: '$paymentMethod',
               total: { $sum: '$total' },
            },
         },
         {
            $project: {
               _id: 0,
               method: '$_id',
               total: 1,
            },
         },
         {
            $sort: { method: 1 },
         },
      ]);

      const thisMonthAmount = (
         await Order.find({
            paid: true,
            createdAt: {
               $gte: moment().startOf('month').format('YYYY-MM-DD'),
               $lte: moment().endOf('month').format('YYYY-MM-DD'),
            },
         })
      ).reduce((cur, item) => item.total + cur, 0);

      const lastMonthAmount = (
         await Order.find({
            paid: true,
            createdAt: {
               $gte: moment()
                  .add(-1, 'month')
                  .startOf('month')
                  .format('YYYY-MM-DD'),
               $lte: moment()
                  .add(-1, 'month')
                  .endOf('month')
                  .format('YYYY-MM-DD'),
            },
         })
      ).reduce((cur, item) => item.total + cur, 0);

      const totalAmount = (await Order.find({ paid: true })).reduce(
         (cur, item) => item.total + cur,
         0
      );
      responseHandler.ok(res, {
         toDayOrder,
         yesterdayOrder,
         thisMonthAmount,
         lastMonthAmount,
         totalAmount,
      });
   } catch {
      responseHandler.error(res);
   }
};
export const dashboardChart = async (req: Request, res: Response) => {
   try {
      const orders = await Order.aggregate([
         {
            $match: {
               createdAt: {
                  $gte: new Date(
                     moment().add(-6, 'day').startOf('day').toDate()
                  ),
                  $lt: new Date(),
               },
            },
         },
         {
            $project: {
               createdAt: {
                  $dateToString: { format: '%d-%m-%Y', date: '$createdAt' },
               },
            },
         },
         {
            $group: {
               _id: '$createdAt',
               count: { $sum: 1 },
            },
         },
         {
            $project: {
               _id: 0,
               date: '$_id',
               count: 1,
            },
         },
         {
            $sort: { date: 1 },
         },
      ]);
      responseHandler.ok(res, { orders });
   } catch {
      responseHandler.error(res);
   }
};
