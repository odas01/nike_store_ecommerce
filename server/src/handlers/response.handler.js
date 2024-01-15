"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const responseWithData = (res, statusCode, data) => res.status(statusCode).json(data);
// ------------------------------------ //
const ok = (res, data) => responseWithData(res, 200, data);
const created = (res, data) => responseWithData(res, 201, data);
const badrequest = (res, message) => responseWithData(res, 400, {
    status: 400,
    message,
});
const unauthorize = (res) => responseWithData(res, 401, {
    status: 401,
    message: {
        vi: 'Tài khoản không đủ quyền',
        en: 'Auth Failed (Unauthorized)!',
    },
});
const notfound = (res) => responseWithData(res, 404, {
    status: 404,
    message: {
        vi: 'Không tìm thấy tài nguyên',
        en: 'Resource not found',
    },
});
const error = (res) => {
    return responseWithData(res, 500, {
        status: 500,
        message: {
            vi: 'Lỗi server',
            en: 'Oops! Something wrong!',
        },
    });
};
exports.default = {
    ok,
    created,
    badrequest,
    unauthorize,
    notfound,
    error,
};
