import { NextFunction, Request, Response } from 'express';

import Product from '../models/product.model';
import responseHandler from '../handlers/response.handler';
import { IVariant } from '../types/product';
import { uploadMultiple, uploadSingle } from '../middleware/images.middleware';
import Variant from '../models/variant.model';
import Order from '../models/order.model';
import slugify from 'slugify';

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
         return responseHandler.badrequest(res, {
            vi: 'Tên sản phẩm đã tồn tại',
            en: 'Product name already exists',
         });
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

      responseHandler.created(res, {
         product,
         message: {
            vi: 'Thêm sản phẩm thành công',
            en: 'Successfully added product',
         },
      });
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
         .lean()
         .sort(res.locals.sort)
         .skip(skip)
         .limit(limit);

      responseHandler.ok(res, { products, page, lastPage, total });
   } catch (err) {
      responseHandler.error(res);
   }
};

export const getOne = async (req: Request, res: Response) => {
   const slug = req.params.slug;
   const status = req.query.status;
   const filter: any = {
      slug,
   };
   if (status) {
      filter.status = status;
   }
   try {
      const product = await Product.findOne(filter)
         .lean()
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
      if (!product) {
         return responseHandler.notfound(res);
      }

      responseHandler.ok(res, product);
   } catch (err) {
      responseHandler.error(res);
   }
};

export const updateOne = async (req: Request, res: Response) => {
   const { slug } = req.params;

   try {
      if (req.body.name) {
         const foundProduct = await Product.findOne({ name: req.body.name });

         if (foundProduct) {
            return responseHandler.badrequest(res, {
               vi: 'Tên sản phẩm đã tồn tại',
               en: 'Product name already exists',
            });
         }

         const foundProduct2 = await Product.findOne({ slug }).lean();
         if (foundProduct2 && foundProduct2.name !== req.body.name) {
            req.body.slug = slugify(req.body.name, {
               lower: true,
            });
         }
      }

      const product = await Product.findOneAndUpdate({ slug }, req.body, {
         new: true,
      }).lean();

      return responseHandler.ok(res, {
         product,
         message: {
            vi: 'Cập nhật sản phẩm thành công',
            en: 'Successfully updated product',
         },
      });
   } catch (err) {
      responseHandler.error(res);
   }
};

export const deleteOne = async (req: Request, res: Response) => {
   const _id = req.params.slug;
   try {
      const order = await Order.find({ 'products.product': _id }).lean();
      if (order.length > 0) {
         return responseHandler.badrequest(res, {
            vi: 'Khổng thể xóa sản phẩm đã thanh toán',
            en: 'Paid products cannot be deleted',
         });
      }

      const product = await Product.findByIdAndDelete({ _id }).lean();
      await Variant.deleteMany({
         _id: {
            $in: product?.variants,
         },
      });
      responseHandler.ok(res, {
         message: {
            vi: 'Xóa sản phẩm thành công',
            en: 'Successfully deleted product',
         },
      });
   } catch (err) {
      responseHandler.error(res);
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

export const count = async (
   req: Request,
   res: Response,
   next: NextFunction
) => {
   try {
      const count = await Product.countDocuments({});
      responseHandler.ok(res, { count });
   } catch (err) {
      responseHandler.error(res);
   }
};
