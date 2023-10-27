import { Request, Response } from 'express';

import Chat from '../models/chat.model';
import responseHandler from '../handlers/response.handler';
import User from '../models/user.model';

export const create = async (req: Request, res: Response) => {
   const { customerId } = req.body;
   const currentId = res.locals.user._id;
   let rootId = currentId;

   try {
      if (!customerId) {
         const foundRoot = await User.findOne({ role: 'root' });
         rootId = foundRoot?._id;
      }

      const foundChat = await Chat.findOne({
         members: { $all: [rootId, customerId] },
      }).lean();

      if (foundChat) {
         return responseHandler.badrequest(res, 'Chat already exists');
      }

      const chat = await Chat.create({
         members: [rootId, customerId],
      });
      return responseHandler.created(res, chat);
   } catch {
      responseHandler.error(res);
   }
};

export const get = async (req: Request, res: Response) => {
   const { _id } = res.locals.user;

   try {
      const chats = await Chat.find({ members: _id });
      responseHandler.created(res, chats);
   } catch {
      responseHandler.error(res);
   }
};
