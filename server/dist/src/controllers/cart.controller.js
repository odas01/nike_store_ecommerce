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
exports.deleteItems = exports.updateItem = exports.create = exports.getOne = void 0;
const response_handler_1 = __importDefault(require("../handlers/response.handler"));
const cartItem_model_1 = __importDefault(require("../models/cartItem.model"));
const variant_model_1 = __importDefault(require("../models/variant.model"));
const getOne = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { _id: user } = res.locals.user;
    try {
        const cartItems = yield cartItem_model_1.default.find({ user })
            .lean()
            .populate({
            path: 'product',
            select: 'name discount category prices slug',
            populate: {
                path: 'category',
                select: '-_id name store',
                options: { lean: true },
            },
            options: { lean: true },
        })
            .populate({
            path: 'variant',
            select: 'color thumbnail',
            populate: {
                path: 'color',
                select: '-_id name value',
            },
        })
            .sort({ updatedAt: -1 });
        response_handler_1.default.ok(res, { items: cartItems, total: cartItems.length });
    }
    catch (_a) {
        response_handler_1.default.error(res);
    }
});
exports.getOne = getOne;
const create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const { _id: user } = res.locals.user;
    try {
        const variant = yield variant_model_1.default.findOne({ _id: req.body.variant }).lean();
        if (variant) {
            const stock = (_b = variant.sizes.find((item) => item.size === req.body.size)) === null || _b === void 0 ? void 0 : _b.stock;
            if (stock) {
                if (req.body.qty > stock) {
                    return response_handler_1.default.badrequest(res, {
                        en: `Sorry, you can only buy a maximum of ${stock > 1
                            ? `${stock + ' products'}`
                            : `${stock + ' product'}`}`,
                        vi: `Xin lỗi, bạn chỉ có thể mua tối đa ${stock} sản phẩm`,
                    });
                }
            }
            const cartItem = yield cartItem_model_1.default.findOne({
                user,
                variant: req.body.variant,
                size: req.body.size,
            }).lean();
            if (!cartItem)
                yield cartItem_model_1.default.create(Object.assign(Object.assign({}, req.body), { user }));
            else
                yield cartItem_model_1.default.updateOne({ user, variant: req.body.variant, size: req.body.size }, { qty: cartItem.qty + req.body.qty });
            return response_handler_1.default.created(res, {
                message: {
                    en: 'Added to cart',
                    vi: 'Đã thêm vào giỏ hàng',
                },
            });
        }
        response_handler_1.default.ok(res, {});
    }
    catch (_c) {
        response_handler_1.default.error(res);
    }
});
exports.create = create;
const updateItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _d;
    const itemId = req.params.itemId;
    try {
        const variant = yield variant_model_1.default.findOne({ _id: req.body.variant }).lean();
        if (variant) {
            const stock = (_d = variant.sizes.find((item) => item.size === req.body.size)) === null || _d === void 0 ? void 0 : _d.stock;
            if (stock) {
                if (req.body.qty > stock) {
                    return response_handler_1.default.badrequest(res, {
                        en: `Sorry, you can only buy a maximum of ${stock > 1
                            ? `${stock + ' products'}`
                            : `${stock + ' product'}`}`,
                        vi: `Xin lỗi, bạn chỉ có thể mua tối đa ${stock} sản phẩm`,
                    });
                }
                else {
                    const item = yield cartItem_model_1.default.findOneAndUpdate({ _id: itemId }, { qty: req.body.qty }, { new: true })
                        .lean()
                        .populate({
                        path: 'product',
                        select: 'name discount category prices slug',
                        populate: {
                            path: 'category',
                            select: '-_id name store',
                            options: { lean: true },
                        },
                        options: { lean: true },
                    })
                        .populate({
                        path: 'variant',
                        select: 'color thumbnail',
                        populate: {
                            path: 'color',
                            select: '-_id name value',
                        },
                    })
                        .lean();
                    return response_handler_1.default.ok(res, item);
                }
            }
        }
        response_handler_1.default.ok(res, {});
    }
    catch (_e) {
        response_handler_1.default.error(res);
    }
});
exports.updateItem = updateItem;
const deleteItems = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const listId = req.body.listId;
    const user = res.locals.user;
    try {
        if (listId.length > 0) {
            yield cartItem_model_1.default.deleteMany({ _id: listId });
        }
        else {
            yield cartItem_model_1.default.deleteMany({ user: user._id });
        }
        response_handler_1.default.ok(res, {});
    }
    catch (_f) {
        response_handler_1.default.error(res);
    }
});
exports.deleteItems = deleteItems;
