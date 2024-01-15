import { Response } from 'express';
import { Message } from '../types/message';

const responseWithData = (res: Response, statusCode: number, data: any) =>
   res.status(statusCode).json(data);

// ------------------------------------ //

const ok = (res: Response, data: any) => responseWithData(res, 200, data);

const created = (res: Response, data?: any) => responseWithData(res, 201, data);

const badrequest = (res: Response, message: Message) =>
   responseWithData(res, 400, {
      status: 400,
      message,
   });

const unauthorize = (res: Response) =>
   responseWithData(res, 401, {
      status: 401,
      message: {
         vi: 'Tài khoản không đủ quyền',
         en: 'Auth Failed (Unauthorized)!',
      },
   });

const notfound = (res: Response) =>
   responseWithData(res, 404, {
      status: 404,
      message: {
         vi: 'Không tìm thấy tài nguyên',
         en: 'Resource not found',
      },
   });

const error = (res: Response) => {
   return responseWithData(res, 500, {
      status: 500,
      message: {
         vi: 'Lỗi server',
         en: 'Oops! Something wrong!',
      },
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
