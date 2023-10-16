import { Response } from 'express';

const responseWithData = (res: Response, statusCode: number, data: any) =>
   res.status(statusCode).json(data);

// ------------------------------------ //

const ok = (res: Response, data: any) => responseWithData(res, 200, data);

const created = (res: Response, data?: any) => responseWithData(res, 201, data);

const badrequest = (res: Response, message: string) =>
   responseWithData(res, 400, {
      status: 400,
      message,
   });

const unauthorize = (res: Response) =>
   responseWithData(res, 401, {
      status: 401,
      message: 'Auth Failed (Unauthorized)!',
   });

const notfound = (res: Response) =>
   responseWithData(res, 404, {
      status: 404,
      message: 'Resource not found',
   });

const error = (res: Response) => {
   return responseWithData(res, 500, {
      status: 500,
      message: 'Oops! Something wrong!',
   });
};

export default {
   ok,
   created,
   badrequest,
   unauthorize,
   notfound,
   error,
};
