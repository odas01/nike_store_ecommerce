import responseHandler from '../handlers/response.handler';
import CartItem from '../models/cartItem.model';
import { Request, Response } from 'express';
import Variant from '../models/variant.model';

export const getOne = async (req: Request, res: Response) => {
   const { _id: user } = res.locals.user;

   try {
      const cartItems = await CartItem.find({ user })
         .lean()
         .populate({
            path: 'product',
            select: 'name discount category prices slug',
            populate: {
               path: 'category',
               select: '-_id name store',
               options: { lean: true },
            },
            options: { lean: true },
         })
         .populate({
            path: 'variant',
            select: 'color thumbnail',
            populate: {
               path: 'color',
               select: '-_id name value',
            },
         })
         .sort({ updatedAt: -1 });
      responseHandler.ok(res, { items: cartItems, total: cartItems.length });
   } catch {
      responseHandler.error(res);
   }
};

export const create = async (req: Request, res: Response) => {
   const { _id: user } = res.locals.user;

   try {
      const variant = await Variant.findOne({ _id: req.body.variant }).lean();
      if (variant) {
         const stock = variant.sizes.find(
            (item) => item.size === req.body.size
         )?.stock;

         if (stock) {
            if (req.body.qty > stock) {
               return responseHandler.badrequest(res, {
                  en: `Sorry, you can only buy a maximum of ${
                     stock > 1
                        ? `${stock + ' products'}`
                        : `${stock + ' product'}`
                  }`,
                  vi: `Xin lỗi, bạn chỉ có thể mua tối đa ${stock} sản phẩm`,
               });
            }
         }

         const cartItem = await CartItem.findOne({
            user,
            variant: req.body.variant,
            size: req.body.size,
         }).lean();

         if (!cartItem) await CartItem.create({ ...req.body, user });
         else
            await CartItem.updateOne(
               { user, variant: req.body.variant, size: req.body.size },
               { qty: cartItem.qty + req.body.qty }
            );

         return responseHandler.created(res, {
            message: {
               en: 'Added to cart',
               vi: 'Đã thêm vào giỏ hàng',
            },
         });
      }
      responseHandler.ok(res, {});
   } catch {
      responseHandler.error(res);
   }
};

export const updateItem = async (req: Request, res: Response) => {
   const itemId = req.params.itemId;

   try {
      const variant = await Variant.findOne({ _id: req.body.variant }).lean();
      if (variant) {
         const stock = variant.sizes.find(
            (item) => item.size === req.body.size
         )?.stock;

         if (stock) {
            if (req.body.qty > stock) {
               return responseHandler.badrequest(res, {
                  en: `Sorry, you can only buy a maximum of ${
                     stock > 1
                        ? `${stock + ' products'}`
                        : `${stock + ' product'}`
                  }`,
                  vi: `Xin lỗi, bạn chỉ có thể mua tối đa ${stock} sản phẩm`,
               });
            } else {
               const item = await CartItem.findOneAndUpdate(
                  { _id: itemId },
                  { qty: req.body.qty },
                  { new: true }
               )
                  .lean()
                  .populate({
                     path: 'product',
                     select: 'name discount category prices slug',
                     populate: {
                        path: 'category',
                        select: '-_id name store',
                        options: { lean: true },
                     },
                     options: { lean: true },
                  })
                  .populate({
                     path: 'variant',
                     select: 'color thumbnail',
                     populate: {
                        path: 'color',
                        select: '-_id name value',
                     },
                  })
                  .lean();

               return responseHandler.ok(res, item);
            }
         }
      }
      responseHandler.ok(res, {});
   } catch {
      responseHandler.error(res);
   }
};
export const deleteItems = async (req: Request, res: Response) => {
   const listId: string[] = req.body.listId;
   const user = res.locals.user;

   try {
      if (listId.length > 0) {
         await CartItem.deleteMany({ _id: listId });
      } else {
         await CartItem.deleteMany({ user: user._id });
      }

      responseHandler.ok(res, {});
   } catch {
      responseHandler.error(res);
   }
};
