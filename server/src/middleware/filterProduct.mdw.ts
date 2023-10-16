import { NextFunction, Request, Response } from 'express';
import Category from '../models/Category';
import Variant from '../models/Variant';

// type FilterCate = {
//    name?: string;
//    store?: string;
// };
// type Filter = {
//    name:
// }

type Query = {
   name: string;
   store: string;
   category: string;
   price: string[];
   color: string[];
   size: string[];
};

type FilterCate = {
   store: string;
   name: string;
};

const filterProduct = async (
   req: Request,
   res: Response,
   next: NextFunction
) => {
   let filter: any = {};

   const { name, store, category, price, color, size }: Partial<Query> =
      req.query;

   if (name) {
      filter.name = {
         $regex: new RegExp(String(name)),
         $options: 'i',
      };
   }

   if (price) {
      const priceQuery = {
         $or: price.map((item) => {
            let newItem: any = item.split(':').map(Number);

            if (newItem.length > 1) {
               newItem = {
                  'prices.originalPrice': {
                     $gte: newItem[0],
                     $lte: newItem[1],
                  },
               };
            } else newItem = { 'prices.originalPrice': { $gte: newItem[0] } };
            return newItem;
         }),
      };
      filter = {
         ...filter,
         ...priceQuery,
      };
   }

   // store - category
   if (store) {
      let filterCate: Partial<FilterCate> = {
         store: store,
      };

      if (category) {
         filterCate.name = category;
      }
      const ids = (await Category.find(filterCate).lean()).map(
         (item) => item._id
      );

      filter.category = ids;
   }

   if (color || size) {
      let ftPColor: any = {};
      if (color) {
         ftPColor.color = { $in: color };
      }
      if (size) {
         ftPColor['sizes.size'] = { $in: size };
      }
      const productColors = (await Variant.find(ftPColor).lean()).map(
         (item) => item._id
      );
      filter.variants = {
         $in: productColors,
      };
   }

   if (Object.keys(res.locals.sort).includes('sold')) {
      filter.sold = {
         $gte: 1,
      };
   }
   console.log(filter);

   res.locals.filter = filter;

   next();
};

export default filterProduct;
