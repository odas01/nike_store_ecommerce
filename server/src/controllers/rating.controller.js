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
exports.avg = exports.deleteOne = exports.updateOne = exports.getAll = exports.create = void 0;
const rating_model_1 = __importDefault(require("../models/rating.model"));
const order_model_1 = __importDefault(require("../models/order.model"));
const response_handler_1 = __importDefault(require("../handlers/response.handler"));
const mongoose_1 = __importDefault(require("mongoose"));
const create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const rating = yield rating_model_1.default.create(req.body);
        if (rating) {
            yield order_model_1.default.updateOne({
                _id: req.body.order,
                products: { $elemMatch: { product: req.body.product } },
            }, { 'products.$.isRating': true, 'products.$.rating': rating._id });
        }
        response_handler_1.default.created(res, rating);
    }
    catch (_a) {
        response_handler_1.default.error(res);
    }
});
exports.create = create;
const getAll = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { product } = req.query;
    const skip = res.locals.skip;
    const limit = res.locals.limit;
    try {
        const total = yield rating_model_1.default.countDocuments({
            product,
        });
        const page = skip / limit + 1 || 1;
        const lastPage = Math.ceil(total / limit) || 1;
        const ratings = yield rating_model_1.default.find({ product })
            .lean()
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 })
            .populate([
            {
                path: 'user',
                options: {
                    lean: true,
                },
                select: '-_id',
            },
            {
                path: 'product',
                options: {
                    lean: true,
                },
                select: '-_id',
            },
        ]);
        const rateCount = yield rating_model_1.default.aggregate([
            {
                $match: {
                    product: new mongoose_1.default.Types.ObjectId(product),
                },
            },
            {
                $group: {
                    _id: '$rate',
                    count: { $sum: 1 },
                },
            },
            {
                $project: {
                    _id: 0,
                    rate: '$_id',
                    count: 1,
                },
            },
            { $sort: { rate: 1 } },
        ]);
        response_handler_1.default.ok(res, { ratings, page, lastPage, total, rateCount });
    }
    catch (_b) {
        response_handler_1.default.error(res);
    }
});
exports.getAll = getAll;
const updateOne = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        const rating = yield rating_model_1.default.findByIdAndUpdate(id, req.body, {
            new: true,
        }).lean();
        response_handler_1.default.ok(res, rating);
    }
    catch (_c) {
        response_handler_1.default.error(res);
    }
});
exports.updateOne = updateOne;
const deleteOne = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        const rating = yield rating_model_1.default.findByIdAndDelete(id).lean();
        // if (rating) {
        //    await Order.updateOne(
        //       {
        //          _id: req.body.order,
        //          products: { $elemMatch: { product: rating.product } },
        //       },
        //       { 'products.$.isRating': false }
        //    );
        // }
        response_handler_1.default.ok(res, rating);
    }
    catch (_d) {
        response_handler_1.default.error(res);
    }
});
exports.deleteOne = deleteOne;
const avg = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const product = req.params.id;
    try {
        const length = yield rating_model_1.default.countDocuments({ product }).lean();
        const rateCount = yield rating_model_1.default.aggregate([
            {
                $match: {
                    product: new mongoose_1.default.Types.ObjectId(product),
                },
            },
            {
                $group: {
                    _id: '$rate',
                    count: { $sum: 1 },
                },
            },
            {
                $project: {
                    _id: 0,
                    rate: '$_id',
                    count: 1,
                },
            },
            { $sort: { rate: 1 } },
        ]);
        const avg = rateCount.length > 0
            ? (rateCount.reduce((cur, item) => cur + item.rate * item.count, 0) / length).toFixed(1)
            : 5;
        response_handler_1.default.ok(res, {
            rateCount,
            avg,
            length,
        });
    }
    catch (_e) {
        response_handler_1.default.error(res);
    }
});
exports.avg = avg;
