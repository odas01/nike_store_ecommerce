import { Request, Response } from 'express';

import Product from '../models/Product';
import responseHandler from '../handlers/response.handler';
import {
   uploadMultiple,
   uploadSingle,
   destroySingle,
   destroyMultiple,
} from '../middleware/images.middleware';
import { IProduct, IVariant, Image } from '../types/product.type';
import Variant from '../models/Variant';

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
         select: '-_id name value',
         options: {
            lean: true,
         },
      });
      await Product.findByIdAndUpdate(product_id, {
         $push: {
            variants: variant._id,
         },
      });
      responseHandler.created(res, variant);
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

      responseHandler.created(res, variant);
   } catch (err) {
      console.log(err);
   }
};

export const deleteOne = async (req: Request, res: Response) => {
   const _id = req.params.id;
   try {
      await Variant.deleteOne({ _id });
      await Product.findOneAndUpdate(
         { variants: _id },
         {
            $pull: {
               variants: _id,
            },
         }
      ).lean();

      responseHandler.ok(res, {});
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
