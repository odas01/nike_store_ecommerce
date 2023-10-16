import * as z from 'zod';

export const productSchema = z.object({
   name: z.string().nonempty('Name is required'),
   discount: z.number(),
   prices: z.object({
      originalPrice: z
         .number({
            invalid_type_error: 'Price is required',
         })
         .min(1, 'Minimum price is 1vnd'),
      price: z.number(),
   }),
   store: z.string().nonempty('Please chooes category'),
   category: z.string().nonempty('Please chooes category'),
   genders: z.string().array().min(1, 'Please chooes at least 1 gender'),
   desc: z.string(),
   // variants: z
   //    .object({
   //       _id: z.optional(z.string()),
   //       color: z.string().nonempty('Please chooes color or delete color'),

   //       sizes: z
   //          .object({
   //             size: z
   //                .string()
   //                .nonempty('Please chooes size or delete size'),
   //             stock: z
   //                .number({
   //                   invalid_type_error: 'Stock is required',
   //                })
   //                .min(0, 'Minimum stock quantity is 10'),
   //          })
   //          .array(),
   //       thumbnail: z.object({
   //          public_id: z.string(),
   //          url: z.string().nonempty('Image is required'),
   //       }),
   //       images: z
   //          .object({
   //             public_id: z.string(),
   //             url: z.string().nonempty('Image is required'),
   //          })
   //          .array(),
   //    })
   //    .refine((color) => color.sizes.length > 0, {
   //       message: 'Product has at least 1 size. Please add more size',
   //       path: ['color'],
   //    })
   //    .array(),
});
// .superRefine(({ discount, prices }, ctx) => {
//    if (discount.type === 'percent' && discount.value > 100) {
//       ctx.addIssue({
//          code: z.ZodIssueCode.custom,
//          message: 'hohoho',
//          path: ['discount.value'],
//       });
//    } else if (
//       discount.type === 'default' &&
//       prices.originalPrice &&
//       discount.value > prices.originalPrice
//    ) {
//       ctx.addIssue({
//          code: z.ZodIssueCode.custom,
//          message: 'khong duoc nhieu hon gia',
//          path: ['discount.value'],
//       });
//    }
// });
