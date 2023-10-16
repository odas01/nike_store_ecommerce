import { NextFunction, Request, Response } from 'express';
import Category from '../models/Category';
import ProductColor from '../models/Variant';

type Sort = {
   name: number | string;
   createdAt: string | number;
   'prices.originalPrice': number | string;
};

const sortProduct = async (req: Request, res: Response, next: NextFunction) => {
   let sort: Partial<Sort>;

   // sort
   if (req.query.sort) {
      const [key, value] = String(req.query.sort).split(':');

      sort = {
         [key]: Number(value),
      };
   } else {
      sort = {
         createdAt: -1,
      };
   }

   res.locals.sort = sort;

   next();
};

export default sortProduct;
