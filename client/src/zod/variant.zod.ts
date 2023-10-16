import * as z from 'zod';

export const variantSchema = z.object({
   color: z.string().nonempty('Please chooes color or delete color'),
   sizes: z
      .object({
         size: z.string().nonempty('Please chooes size or delete size'),
         stock: z
            .number({
               invalid_type_error: 'Stock is required',
            })
            .min(0, 'Minimum stock quantity is 10'),
      })
      .array(),
   thumbnail: z.object({
      public_id: z.string(),
      url: z.string().nonempty('Image is required'),
   }),
   images: z
      .object({
         public_id: z.string(),
         url: z.string().nonempty('Image is required'),
      })
      .array(),
});
