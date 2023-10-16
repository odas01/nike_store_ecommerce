import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';

import responseHandler from './response.handler';

export const validate = (req: Request, res: Response, next: NextFunction) => {
   const errors = validationResult(req);

   if (!errors.isEmpty())
      return responseHandler.badrequest(res, errors.array()[0].msg);

   next();
};
