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
exports.dashboardChart = exports.dashboardAmount = exports.dashboardCount = exports.deleteOne = exports.updateOne = exports.getOne = exports.getAll = exports.create = exports.vnPay = void 0;
const moment_1 = __importDefault(require("moment"));
const qs_1 = __importDefault(require("qs"));
const crypto_1 = __importDefault(require("crypto"));
const response_handler_1 = __importDefault(require("../handlers/response.handler"));
const order_model_1 = __importDefault(require("../models/order.model"));
const cartItem_model_1 = __importDefault(require("../models/cartItem.model"));
const product_model_1 = __importDefault(require("../models/product.model"));
const variant_model_1 = __importDefault(require("../models/variant.model"));
const sendMail_1 = require("../config/sendMail");
const coupon_model_1 = __importDefault(require("../models/coupon.model"));
const vnPay = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let date = new Date();
    let createDate = (0, moment_1.default)(date).format('YYYYMMDDHHmmss');
    let tmnCode = String(process.env.VNPAY_TMNCODE);
    let secretKey = String(process.env.VNPAY_SERCET_KEY);
    let vnpUrl = 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html';
    let returnUrl = 'http://localhost:3001/checkout/success';
    let orderId = (0, moment_1.default)(date).format('DDHHmmss');
    let amount = req.body.total;
    let ipAddr = req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;
    let currCode = 'VND';
    let vnp_Params = {};
    vnp_Params['vnp_Version'] = '2.1.0';
    vnp_Params['vnp_Command'] = 'pay';
    vnp_Params['vnp_TmnCode'] = tmnCode;
    vnp_Params['vnp_Locale'] = 'vn';
    vnp_Params['vnp_CurrCode'] = currCode;
    vnp_Params['vnp_TxnRef'] = orderId;
    vnp_Params['vnp_OrderInfo'] = 'Thanh toan cho ma GD:' + orderId;
    vnp_Params['vnp_OrderType'] = 'other';
    vnp_Params['vnp_Amount'] = amount * 100;
    vnp_Params['vnp_ReturnUrl'] = returnUrl;
    vnp_Params['vnp_IpAddr'] = ipAddr;
    vnp_Params['vnp_CreateDate'] = createDate;
    vnp_Params = sortObject(vnp_Params);
    let signData = qs_1.default.stringify(vnp_Params, { encode: false });
    let hmac = crypto_1.default.createHmac('sha512', secretKey);
    let signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');
    vnp_Params['vnp_SecureHash'] = signed;
    vnpUrl += '?' + qs_1.default.stringify(vnp_Params, { encode: false });
    res.locals.vnpUrl = vnpUrl;
    next();
});
exports.vnPay = vnPay;
function sortObject(obj) {
    let sorted = {};
    let str = [];
    let key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) {
            str.push(encodeURIComponent(key));
        }
    }
    str.sort();
    for (key = 0; key < str.length; key++) {
        sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, '+');
    }
    return sorted;
}
const filterOrder = (query) => {
    const { search, paymentMethod, status, user } = query;
    let filter = {};
    if (search)
        filter = Object.assign(Object.assign({}, filter), { $or: [{ phone: { $regex: new RegExp(search), $options: 'i' } }] });
    if (paymentMethod) {
        filter.paymentMethod = paymentMethod;
    }
    if (status) {
        filter.status = status;
    }
    if (user) {
        filter.user = user;
    }
    return filter;
};
const sortOrder = (query) => {
    let sort = {};
    if (query.sort) {
        const [key, value] = String(query.sort).split(':');
        sort = {
            [key]: Number(value),
        };
    }
    else {
        sort = {
            createdAt: -1,
        };
    }
    return sort;
};
const create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { _id, email } = res.locals.user;
    const vnpUrl = res.locals.vnpUrl;
    try {
        const order = yield order_model_1.default.create(Object.assign(Object.assign({}, req.body), { user: _id }));
        yield Promise.all([
            ...req.body.products.map((item) => __awaiter(void 0, void 0, void 0, function* () {
                return product_model_1.default.updateOne({ _id: item.product }, { $inc: { sold: item.qty } });
            })),
            ...req.body.products.map((item) => __awaiter(void 0, void 0, void 0, function* () {
                return variant_model_1.default.updateOne({
                    _id: item.variant,
                    sizes: { $elemMatch: { size: item.size } },
                }, { $inc: { 'sizes.$.stock': -item.qty } });
            })),
            coupon_model_1.default.findByIdAndUpdate(req.body.coupon, { $inc: { quantity: -1 } }),
        ]);
        yield cartItem_model_1.default.deleteMany({ user: _id });
        yield (0, sendMail_1.sendMailOrder)(email);
        if (vnpUrl) {
            response_handler_1.default.created(res, {
                vnpUrl,
            });
        }
        else {
            response_handler_1.default.created(res, {
                order,
                message: {
                    vi: 'Tạo đơn hàng thành công',
                    en: 'Successfully created order',
                },
            });
        }
    }
    catch (_a) {
        response_handler_1.default.error(res);
    }
});
exports.create = create;
const getAll = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filter = filterOrder(req.query);
    const sort = sortOrder(req.query);
    const skip = res.locals.skip;
    const limit = res.locals.limit;
    try {
        const total = yield order_model_1.default.countDocuments(filter);
        const page = Number(skip) / Number(limit) + 1 || 1;
        const lastPage = Math.ceil(total / Number(limit)) || 1;
        const orders = yield order_model_1.default.find(filter)
            .lean()
            .sort(sort)
            .skip(Number(skip))
            .limit(Number(limit))
            .populate([
            {
                path: 'user',
                options: {
                    lean: true,
                },
                select: '-_id name email phone role status',
            },
            {
                path: 'products.product',
                options: {
                    lean: true,
                },
                select: '-_id name slug',
            },
            {
                path: 'products.variant',
                options: {
                    lean: true,
                },
                populate: {
                    path: 'color',
                    options: {
                        lean: true,
                    },
                    select: '-_id name value',
                },
                select: '-_id color',
            },
            {
                path: 'coupon',
                options: {
                    lean: true,
                },
                select: '-_id',
            },
        ]);
        response_handler_1.default.ok(res, { page, lastPage, orders, total });
    }
    catch (err) {
        response_handler_1.default.error(res);
    }
});
exports.getAll = getAll;
const getOne = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        const order = yield order_model_1.default.findById(id)
            .populate([
            'products.product',
            'products.rating',
            'user',
            { path: 'products.variant', populate: 'color' },
        ])
            .lean();
        response_handler_1.default.ok(res, order);
    }
    catch (_b) {
        response_handler_1.default.error(res);
    }
});
exports.getOne = getOne;
const updateOne = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        const order = yield order_model_1.default.findByIdAndUpdate(id, req.body, {
            new: true,
        }).lean();
        response_handler_1.default.ok(res, {
            order,
            message: {
                vi: 'Cập nhật đơn hàng thành công',
                en: 'Successfully updated order',
            },
        });
    }
    catch (_c) {
        response_handler_1.default.error(res);
    }
});
exports.updateOne = updateOne;
const deleteOne = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        yield order_model_1.default.findByIdAndDelete(id).lean();
        response_handler_1.default.ok(res, {
            message: {
                vi: 'Xóa đơn hàng thành công',
                en: 'Successfully deleted order',
            },
        });
    }
    catch (_d) {
        response_handler_1.default.error(res);
    }
});
exports.deleteOne = deleteOne;
const dashboardCount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orders = yield order_model_1.default.aggregate([
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 },
                },
            },
            {
                $project: {
                    _id: 0,
                    status: '$_id',
                    count: 1,
                },
            },
        ]);
        response_handler_1.default.ok(res, { orders });
    }
    catch (_e) {
        response_handler_1.default.error(res);
    }
});
exports.dashboardCount = dashboardCount;
const dashboardAmount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const toDayOrder = yield order_model_1.default.aggregate([
            {
                $match: {
                    createdAt: {
                        $gte: new Date((0, moment_1.default)().startOf('day').toDate()),
                        $lt: new Date(),
                    },
                    paid: true,
                },
            },
            {
                $group: {
                    _id: '$paymentMethod',
                    total: { $sum: '$total' },
                },
            },
            {
                $project: {
                    _id: 0,
                    method: '$_id',
                    total: 1,
                },
            },
            {
                $sort: { method: 1 },
            },
        ]);
        const yesterdayOrder = yield order_model_1.default.aggregate([
            {
                $match: {
                    createdAt: {
                        $gte: new Date((0, moment_1.default)().add(-1, 'day').startOf('day').toDate()),
                        $lt: new Date((0, moment_1.default)().add(-1, 'day').endOf('day').toDate()),
                    },
                    paid: true,
                },
            },
            {
                $group: {
                    _id: '$paymentMethod',
                    total: { $sum: '$total' },
                },
            },
            {
                $project: {
                    _id: 0,
                    method: '$_id',
                    total: 1,
                },
            },
            {
                $sort: { method: 1 },
            },
        ]);
        const thisMonthAmount = (yield order_model_1.default.find({
            paid: true,
            createdAt: {
                $gte: (0, moment_1.default)().startOf('month').format('YYYY-MM-DD'),
                $lte: (0, moment_1.default)().endOf('month').format('YYYY-MM-DD'),
            },
        })).reduce((cur, item) => item.total + cur, 0);
        const lastMonthAmount = (yield order_model_1.default.find({
            paid: true,
            createdAt: {
                $gte: (0, moment_1.default)()
                    .add(-1, 'month')
                    .startOf('month')
                    .format('YYYY-MM-DD'),
                $lte: (0, moment_1.default)()
                    .add(-1, 'month')
                    .endOf('month')
                    .format('YYYY-MM-DD'),
            },
        })).reduce((cur, item) => item.total + cur, 0);
        const totalAmount = (yield order_model_1.default.find({ paid: true })).reduce((cur, item) => item.total + cur, 0);
        response_handler_1.default.ok(res, {
            toDayOrder,
            yesterdayOrder,
            thisMonthAmount,
            lastMonthAmount,
            totalAmount,
        });
    }
    catch (_f) {
        response_handler_1.default.error(res);
    }
});
exports.dashboardAmount = dashboardAmount;
const dashboardChart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orders = yield order_model_1.default.aggregate([
            {
                $match: {
                    createdAt: {
                        $gte: new Date((0, moment_1.default)().add(-6, 'day').startOf('day').toDate()),
                        $lt: new Date(),
                    },
                },
            },
            {
                $project: {
                    createdAt: {
                        $dateToString: { format: '%d-%m-%Y', date: '$createdAt' },
                    },
                },
            },
            {
                $group: {
                    _id: '$createdAt',
                    count: { $sum: 1 },
                },
            },
            {
                $project: {
                    _id: 0,
                    date: '$_id',
                    count: 1,
                },
            },
            {
                $sort: { date: 1 },
            },
        ]);
        response_handler_1.default.ok(res, { orders });
    }
    catch (_g) {
        response_handler_1.default.error(res);
    }
});
exports.dashboardChart = dashboardChart;
