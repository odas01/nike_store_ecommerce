import { NextFunction, Request, Response } from 'express';

import Product from '../models/product.model';
import responseHandler from '../handlers/response.handler';
import { IVariant } from '../types/product.type';
import { uploadMultiple, uploadSingle } from '../middleware/images.middleware';
import Variant from '../models/variant.model';
import Order from '../models/order.model';

const createVariant = async (variants: IVariant) => {
   const thumbnail = await uploadSingle(variants.thumbnail.url);

   const images = await uploadMultiple(
      variants.images.map((image) => image.url)
   );

   return await Variant.create({
      ...variants,
      thumbnail,
      images,
   });
};

export const create = async (req: Request, res: Response) => {
   const { color, sizes, thumbnail, price, images, ...value } = req.body;

   try {
      const foundProduct = await Product.findOne({ name: value.name });
      if (foundProduct) {
         return responseHandler.badrequest(res, 'Product name already exists');
      }

      const variant = await createVariant({
         color,
         sizes,
         thumbnail,
         images,
      } as IVariant);

      const product = await Product.create({
         ...value,
         variants: [variant._id],
      });

      responseHandler.created(res, product);
   } catch (err) {
      responseHandler.error(res);
   }
};

export const getAll = async (req: Request, res: Response) => {
   const skip = res.locals.skip;
   const limit = res.locals.limit;

   try {
      const total = await Product.countDocuments(res.locals.filter);

      const page = skip / limit + 1 || 1;
      const lastPage = Math.ceil(total / limit) || 1;

      const products = await Product.find(res.locals.filter)
         .populate([
            {
               path: 'category',
               select: 'name vnName store',
               options: { lean: true },
            },
            {
               path: 'variants',
               options: { lean: true },
               populate: {
                  path: 'color',
                  select: 'name vnName value',
                  options: { lean: true },
               },
            },
         ])
         .sort(res.locals.sort)
         .skip(skip)
         .limit(limit)
         .lean();

      responseHandler.ok(res, { products, page, lastPage, total });
   } catch (err) {
      responseHandler.error(res);
   }
};

export const getOne = async (req: Request, res: Response) => {
   const slug = req.params.slug;
   try {
      const product = await Product.findOne({ slug })
         .populate({
            path: 'category',
            select: '-_id name vnName store',
         })
         .populate({
            path: 'variants',
            populate: {
               path: 'color',
               select: '-_id name vnName value',
            },
         });

      responseHandler.ok(res, product);
   } catch (err) {
      responseHandler.error(res);
   }
};

export const updateOne = async (req: Request, res: Response) => {
   const { slug } = req.params;
   try {
      const product = await Product.findOneAndUpdate({ slug }, req.body, {
         new: true,
      });
      return responseHandler.ok(res, product);
   } catch (err) {
      responseHandler.error(res);
   }
};

export const deleteOne = async (req: Request, res: Response) => {
   const _id = req.params.slug;
   try {
      const order = await Order.find({ 'products.product': _id });
      if (order.length > 0) {
         return responseHandler.badrequest(
            res,
            'Paid products cannot be deleted'
         );
      }

      const product = await Product.findByIdAndDelete({ _id });
      await Variant.deleteMany({
         _id: {
            $in: product?.variants,
         },
      });
      responseHandler.ok(res, {});
   } catch (err) {
      console.log(err);
   }
};

export const similar = async (
   req: Request,
   res: Response,
   next: NextFunction
) => {
   const { slug } = req.params;
   res.locals.filter.slug = { $ne: slug };

   next();
};
