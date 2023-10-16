import cloudinary from '../config/cloudinary.config';

const folderName: string = 'nikeshop';

export const uploadSingle = async (file: string, folder = 'product') => {
   try {
      const { public_id, url } = await cloudinary.uploader.upload(file, {
         folder: folderName + '/' + folder,
      });
      return { public_id, url };
   } catch (err) {
      console.log(err);
   }
};

export const uploadMultiple = async (files: string[]) => {
   try {
      const results = [];
      for (const file of files) {
         const result = await uploadSingle(file);
         results.push(result);
      }
      return results;
   } catch (err) {
      console.log(err);
   }
};

export const destroySingle = async (public_id: string) => {
   try {
      const result = await cloudinary.uploader.destroy(public_id);
      return result;
   } catch (err) {
      console.log(err);
   }
};

export const destroyMultiple = async (public_ids: string[]) => {
   try {
      for (const public_id of public_ids) {
         await destroySingle(public_id);
      }
   } catch (err) {
      console.log(err);
   }
};
