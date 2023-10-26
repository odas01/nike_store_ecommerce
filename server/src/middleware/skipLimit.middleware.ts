import { NextFunction, Request, Response } from 'express';

const skipLimit = async (req: Request, res: Response, next: NextFunction) => {
   let skip = Number(req.query.skip);
   let limit = Number(req.query.limit);

   if (isNaN(skip)) {
      skip = 0;
   }
   if (isNaN(limit)) {
      limit = 15;
   }

   res.locals.skip = skip;
   res.locals.limit = limit;

   next();
};

export default skipLimit;
