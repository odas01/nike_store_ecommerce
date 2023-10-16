import responseHandler from '../handlers/response.handler';
import CartItem from '../models/CartItem';
import { Request, Response } from 'express';
import Variant from '../models/Variant';

export const getOne = async (req: Request, res: Response) => {
   const { _id: user } = res.locals.user;

   try {
      const cartItems = await CartItem.find({ user })
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
         .lean()
         .sort({ updatedAt: -1 });
      responseHandler.ok(res, { items: cartItems, total: cartItems.length });
   } catch {
      responseHandler.error(res);
   }
};

export const create = async (req: Request, res: Response) => {
   const { _id: user } = res.locals.user;

   try {
      const { variant, size, qty } = req.body;

      const cartItem = await CartItem.findOne({
         user,
         variant,
         size,
      });

      if (!cartItem) await CartItem.create({ ...req.body, user });
      else
         await CartItem.updateOne(
            { user, variant, size },
            { qty: cartItem.qty + qty }
         );

      responseHandler.ok(res, { msg: 'Created' });
   } catch {
      responseHandler.error(res);
   }
};
export const deleteOne = async (req: Request, res: Response) => {
   // const { _id: user } = req.user;
   // try {
   //    await CartItem.deleteMany({ user });
   //    responseHandler.ok(res, { msg: 'Deleted' });
   // } catch {
   //    responseHandler.error(res);
   // }
};

export const deleteOneOrAll = async (req: Request, res: Response) => {
   try {
      // await CartItem.deleteMany({ user: req.params.id });

      // if (!req.boody) {
      //    await CartItem.deleteMany({ user: req.params.id });
      // }
      responseHandler.ok(res, { msg: 'Deleted all' });
   } catch {
      responseHandler.error(res);
   }
};

export const updateItem = async (req: Request, res: Response) => {
   const itemId = req.params.itemId;

   try {
      const variant = await Variant.findOne({ _id: req.body.variant });
      if (variant) {
         const stock = variant.sizes.find(
            (item) => item.size === req.body.size
         )?.stock;
         console.log(stock);

         if (stock) {
            if (req.body.qty > stock) {
               return responseHandler.badrequest(
                  res,
                  `Sorry, you can only buy max ${stock} in one checkout`
               );
            } else {
               const item = await CartItem.findOneAndUpdate(
                  { _id: itemId },
                  { qty: req.body.qty },
                  { new: true }
               )
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

      // const item = await CartItem.findByIdAndUpdate(itemId, req.body, {
      //    new: true,
      //    update: true,
      // }).populate('product');

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
      setTimeout(() => {
         responseHandler.ok(res, { msg: 'Delete successfully' });
      }, 1000);
   } catch {
      responseHandler.error(res);
   }
};
