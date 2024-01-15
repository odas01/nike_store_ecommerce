"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkOne = exports.deleteOne = exports.updateOne = exports.getAll = exports.create = exports.send = void 0;
const coupon_model_1 = __importDefault(require("../models/coupon.model"));
const response_handler_1 = __importDefault(require("../handlers/response.handler"));
const order_model_1 = __importDefault(require("../models/order.model"));
const moment_1 = __importDefault(require("moment"));
const user_model_1 = __importDefault(require("../models/user.model"));
const sendMail_1 = require("../config/sendMail");
const send = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const coupon = yield coupon_model_1.default.findById(req.params.id);
        const users = yield user_model_1.default.find({ role: 'customer', status: 'active' });
        if (users.length > 0 && coupon) {
            const emails = users.map((item) => item.email);
            const value = coupon.type === 'percent'
                ? `${coupon.value}%`
                : `${coupon.value}vnd`;
            yield (0, sendMail_1.sendMultipleEmail)(emails, coupon.name, coupon.code, value, coupon.expirationDate);
        }
        response_handler_1.default.created(res, {
            coupon,
            message: {
                vi: 'Gửi mã giảm giá đến khách hàng thành công',
                en: 'Successfully sent coupon to customers',
            },
        });
    }
    catch (_a) {
        response_handler_1.default.error(res);
    }
});
exports.send = send;
const create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const coupon = yield coupon_model_1.default.create(req.body);
        response_handler_1.default.created(res, {
            coupon,
            message: {
                vi: 'Thêm phiếu giảm giá thành công',
                en: 'Successfully added coupon',
            },
        });
    }
    catch (_b) {
        response_handler_1.default.error(res);
    }
});
exports.create = create;
const getAll = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name } = req.query;
    const skip = res.locals.skip || 0;
    const limit = res.locals.limit || 15;
    const filter = name
        ? {
            name: { $regex: new RegExp(String(name)), $options: 'i' },
        }
        : {};
    try {
        const total = yield coupon_model_1.default.countDocuments(filter);
        const page = skip / limit + 1 || 1;
        const lastPage = Math.ceil(total / limit) || 1;
        const coupons = yield coupon_model_1.default.find(filter)
            .lean()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);
        response_handler_1.default.ok(res, { coupons, page, lastPage, total });
    }
    catch (_c) {
        response_handler_1.default.error(res);
    }
});
exports.getAll = getAll;
const updateOne = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        const coupon = yield coupon_model_1.default.findByIdAndUpdate(id, req.body, {
            new: true,
        }).lean();
        response_handler_1.default.ok(res, {
            coupon,
            message: {
                vi: 'Cập nhật phiếu giàm giá thành công',
                en: 'Successfully updated coupon',
            },
        });
    }
    catch (_d) {
        response_handler_1.default.error(res);
    }
});
exports.updateOne = updateOne;
const deleteOne = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        const canDelete = yield order_model_1.default.find({ coupon: req.params.id }).lean();
        if (canDelete.length > 0) {
            return response_handler_1.default.badrequest(res, {
                vi: 'Không thể xóa phiếu giảm giá đã sử dụng',
                en: 'Cannot delete coupon that already used',
            });
        }
        yield coupon_model_1.default.findByIdAndDelete(id).lean();
        response_handler_1.default.ok(res, {
            message: {
                vi: 'Xóa phiếu giảm giá thành công',
                en: 'Successfully deleted coupon',
            },
        });
    }
    catch (_e) {
        response_handler_1.default.error(res);
    }
});
exports.deleteOne = deleteOne;
const checkOne = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const code = req.params.id;
    const { _id } = res.locals.user;
    try {
        const coupon = yield coupon_model_1.default.findOne({ code });
        if (!coupon) {
            return response_handler_1.default.badrequest(res, {
                vi: 'Mã giảm giá không tồn tại',
                en: 'Coupon does not exist',
            });
        }
        if (coupon) {
            if ((0, moment_1.default)().isAfter(coupon.expirationDate)) {
                return response_handler_1.default.badrequest(res, {
                    vi: 'Mã giảm giá quá hạn',
                    en: 'Coupon has expired',
                });
            }
            if (coupon.quantity <= 0) {
                return response_handler_1.default.badrequest(res, {
                    vi: 'Mã giảm giá đã hết',
                    en: 'Coupon has expired',
                });
            }
            const isUsed = yield order_model_1.default.findOne({
                user: _id,
                coupon: coupon._id,
            }).lean();
            if (isUsed) {
                return response_handler_1.default.badrequest(res, {
                    vi: 'Mã giảm giá đã được sử dụng',
                    en: 'Coupon has been used',
                });
            }
        }
        response_handler_1.default.ok(res, coupon);
    }
    catch (_f) {
        response_handler_1.default.error(res);
    }
});
exports.checkOne = checkOne;
