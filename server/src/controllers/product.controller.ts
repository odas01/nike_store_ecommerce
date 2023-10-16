import { NextFunction, Request, Response } from 'express';

import Product from '../models/Product';
import responseHandler from '../handlers/response.handler';
import { IVariant, Image } from '../types/product.type';
import { uploadMultiple, uploadSingle } from '../middleware/images.middleware';
import Variant from '../models/Variant';
import slugify from 'slugify';
import Order from '../models/Order';

const formatPrice = (data: any) => {
   const { price, originalPrice } = data.prices;
   let prices = { price, originalPrice };

   if (data.discount.type === 'percent') {
      prices.price =
         originalPrice - (originalPrice * data.discount.value) / 100;
   } else {
      prices.price = originalPrice - data.discount.value;
   }
   data.prices = prices;

   return data.price;
};

const createVariants = async (variants: IVariant[]): Promise<string[]> => {
   const variants_id = variants.map(async (item) => {
      const thumbnail = await uploadSingle(item.thumbnail.url);

      const images = await uploadMultiple(
         item.images.map((image) => image.url)
      );

      const color = await Variant.create({
         ...item,
         thumbnail,
         images,
      });
      return color._id;
   });
   return Promise.all(variants_id);
};
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
   const { skip, limit }: any = req.query;

   try {
      const total = await Product.countDocuments(res.locals.filter);

      const page = skip / limit + 1 || 1;
      const lastPage = Math.ceil(total / limit) || 1;

      const products = await Product.find(res.locals.filter)
         .populate([
            {
               path: 'category',
               select: '-_id name store',
               options: { lean: true },
            },
            {
               path: 'variants',
               options: { lean: true },
               populate: {
                  path: 'color',
                  select: '-_id name value',
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
            select: '-_id name store',
         })
         .populate({
            path: 'variants',
            populate: {
               path: 'color',
               select: '-_id name value',
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
      console.log(req.body);

      const product = await Product.findOne({ slug });
      if (product) {
         if (req.body.thumbnail.public_id.slice(0, 8) !== 'nikeshop') {
            const thumbnail = await uploadSingle(req.body.thumbnail.url);
            if (thumbnail) {
               req.body.thumbnail = thumbnail;
            }
         }

         const newImage = await Promise.all(
            req.body.images
               .map(async (item: Image) => {
                  if (item.public_id.slice(0, 8) !== 'nikeshop') {
                     const res = await uploadSingle(item.url);
                     if (res) return res;
                  }
                  return item;
               })
               .filter((item: Image) => item)
         );
         if (newImage) {
            req.body.images = newImage;
         }

         req.body.slug = slugify(req.body.name, { lower: true });

         // const newImage = await Promise.all(
         //    item.images
         //       .map(async (item) => {
         //          if (item.public_id.slice(0, 8) !== 'nikeshop') {
         //             const res = await uploadSingle(item.url);
         //             if (res) return res;
         //          }
         //          return item;
         //       })
         //       .filter((item) => item)
         // );
         // if (newImage) {
         //    item.images = newImage;
         // }

         // const images = product?.images;
         // const colors = product.variants.map(String);
         // const idList: string[] = req.body.variants.map(
         //    (item: IVariant) => item._id
         // );
         // const deleteList = colors.filter((item) => !idList.includes(item));
         // const newList: IVariant[] = req.body.variants.filter(
         //    (item: IVariant) => !item._id
         // );

         // const editList = req.body.variants.filter(
         //    (item: IVariant) => item._id
         // );

         // await Promise.all(
         //    deleteList.map(async (item) => {
         //       await Variant.deleteOne({ _id: item });
         //    })
         // );

         // const newListId = await Promise.all([
         //    ...(await createVariant(newList)),
         //    ...(await Promise.all(
         //       editList.map(async (item: IVariant) => {
         //          if (item.thumbnail.public_id.slice(0, 8) !== 'nikeshop') {
         //             const thumbnail = await uploadSingle(item.thumbnail.url);
         //             if (thumbnail) {
         //                item.thumbnail = thumbnail;
         //             }
         //          }

         //          const newImage = await Promise.all(
         //             item.images
         //                .map(async (item) => {
         //                   if (item.public_id.slice(0, 8) !== 'nikeshop') {
         //                      const res = await uploadSingle(item.url);
         //                      if (res) return res;
         //                   }
         //                   return item;
         //                })
         //                .filter((item) => item)
         //          );
         //          if (newImage) {
         //             item.images = newImage;
         //          }
         //          console.log(newImage);

         //          await Variant.findByIdAndUpdate(item._id, item);
         //          return item._id;
         //       })
         //    )),
         // ]);

         // if (req.body.name !== product.name) {
         //    const randomChar = Math.random().toString(36).substring(4, 10);
         //    req.body.slug = slugify(req.body.name + ' ' + randomChar, {
         //       lower: true,
         //    });
         // }

         // const isNewPrice =
         //    req.body.name !== product.prices.originalPrice ||
         //    req.body.discount.type !== product.discount.type ||
         //    req.body.discount.value !== product.discount.value;
         // if (isNewPrice) {
         //    req.body.prices = formatPrice(req.body);
         // }

         const product = await Product.findOneAndUpdate({ slug }, req.body, {
            new: true,
         });
         return responseHandler.ok(res, product);
      }

      responseHandler.ok(res, {});
   } catch (err) {
      responseHandler.error(res);
   }
};

export const deleteOne = async (req: Request, res: Response) => {
   const { slug } = req.params;
   try {
      // const product = await Product.findOne({ slug });
      // responseHandler.ok(res, { product });
      // const product = await Product.findOneAndDelete({ slug });
      // if (product) {
      //    await destroySingle(product.image.public_id);
      //    await destroyMultiple(
      //       product.images.map((item: any) => item.public_id)
      //    );
      //    responseHandler.ok(res, { msg: 'Delete successfully.' });
      // } else {
      //    responseHandler.notfound(res);
      // }
   } catch (err) {
      console.log(err);
   }
};

export const related = async (req: Request, res: Response) => {};
