import { Request, Response } from 'express';

import Product from '../models/product.model';
import responseHandler from '../handlers/response.handler';
import {
   uploadSingle,
   uploadMultiple,
   destroyMultiple,
} from '../middleware/images.middleware';
import { Image } from '../types/product';
import Variant from '../models/variant.model';
import Order from '../models/order.model';

export const create = async (req: Request, res: Response) => {
   const { product_id, ...value } = req.body;
   try {
      const thumbnail = await uploadSingle(req.body.thumbnail.url);
      const images = await uploadMultiple(
         req.body.images.map((item: Image) => item.url)
      );

      const variant = await (
         await Variant.create({ ...value, thumbnail, images })
      ).populate({
         path: 'color',
         select: '-_id name vnName value',
         options: {
            lean: true,
         },
      });
      await Product.findByIdAndUpdate(product_id, {
         $push: {
            variants: variant._id,
         },
      }).lean();

      responseHandler.created(res, {
         variant,
         message: {
            vi: 'Thêm biến thể thành công',
            en: 'Successfully added variant',
         },
      });
   } catch (err) {
      responseHandler.error(res);
   }
};

export const updateOne = async (req: Request, res: Response) => {
   const _id = req.params.id;
   const values = req.body;
   try {
      if (values.thumbnail.public_id.slice(0, 8) !== 'nikeshop') {
         const thumbnail = await uploadSingle(values.thumbnail.url);
         if (thumbnail) {
            values.thumbnail = thumbnail;
         }
      }

      const newImage = await Promise.all(
         values.images
            .map(async (item: Image) => {
               if (item.public_id.slice(0, 8) !== 'nikeshop') {
                  const newImage = await uploadSingle(item.url);
                  if (newImage) return newImage;
               }
               return item;
            })
            .filter((item: Image) => item)
      );
      if (newImage) {
         values.images = newImage;
      }
      const variant = await Variant.findByIdAndUpdate(_id, values, {
         new: true,
      }).lean();

      responseHandler.created(res, {
         variant,
         message: {
            vi: 'Cập nhật biến thể thành công',
            en: 'Successfully updated variant',
         },
      });
   } catch (err) {
      responseHandler.error(res);
   }
};

export const deleteOne = async (req: Request, res: Response) => {
   const _id = req.params.id;
   try {
      const order = await Order.find({ 'products.variant': _id });
      if (order.length > 0) {
         return responseHandler.badrequest(res, {
            vi: 'Khổng thể xóa biến thể của sản phẩm đã thanh toán',
            en: 'Paid product variations cannot be deleted',
         });
      }

      await Variant.deleteOne({ _id });
      await Product.findOneAndUpdate(
         { variants: _id },
         {
            $pull: {
               variants: _id,
            },
         }
      ).lean();

      responseHandler.ok(res, {
         message: {
            vi: 'Xóa biến thể thành công',
            en: 'Successfully deleted variant',
         },
      });
   } catch (err) {
      responseHandler.error(res);
   }
};
export const deleteImages = async (req: Request, res: Response) => {
   try {
      await destroyMultiple(req.body.images);

      responseHandler.ok(res, {});
   } catch (err) {
      responseHandler.error(res);
   }
};
