import { Request, Response } from 'express';

import Message from '../models/message.model';
import responseHandler from '../handlers/response.handler';

export const create = async (req: Request, res: Response) => {
   const { _id } = res.locals;

   try {
      const color = await Message.create();
      responseHandler.created(res, { message: 'Created successfully', color });
   } catch {
      responseHandler.error(res);
   }
};

export const get = async (req: Request, res: Response) => {
   try {
      const color = await Message.create(req.body);
      responseHandler.created(res, { message: 'Created successfully', color });
   } catch {
      responseHandler.error(res);
   }
};
