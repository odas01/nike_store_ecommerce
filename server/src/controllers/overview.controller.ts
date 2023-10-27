import { Request, Response } from 'express';

import responseHandler from '../handlers/response.handler';
import Order from '../models/order.model';

export const order = async (req: Request, res: Response) => {
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
