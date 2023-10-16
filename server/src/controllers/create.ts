import { Request, Response } from 'express';
import responseHandler from '../handlers/response.handler';

// const createProductColor = async (
//    colors: IProductColor[]
// ): Promise<string[]> => {
//    const colors_id = colors.map(async (item) => {
//       const thumbnail = await uploadSingle(item.thumbnail.url);
//       const images = await uploadMultiple(
//          item.images.map((image) => image.url)
//       );
//       const color = await ProductColor.create({
//          ...item,
//          thumbnail,
//          images,
//       });
//       return color._id;
//    });
//    return Promise.all(colors_id);
// };

export const create = async (req: Request, res: Response) => {
   const { color, thumbnail, images, sizes, prices, ...value } = req.body;
   console.log(value);

   try {
      // const colors = await createProductColor(req.body.colors);
      // const { _id } = await Product.create({ ...req.body });
      // const product = await Product.findOne({ _id });
      responseHandler.created(res, {});
   } catch (err) {
      responseHandler.error(res);
   }
};
