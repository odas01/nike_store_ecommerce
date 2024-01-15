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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteImages = exports.deleteOne = exports.updateOne = exports.create = void 0;
const product_model_1 = __importDefault(require("../models/product.model"));
const response_handler_1 = __importDefault(require("../handlers/response.handler"));
const images_middleware_1 = require("../middleware/images.middleware");
const variant_model_1 = __importDefault(require("../models/variant.model"));
const order_model_1 = __importDefault(require("../models/order.model"));
const create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const _a = req.body, { product_id } = _a, value = __rest(_a, ["product_id"]);
    try {
        const thumbnail = yield (0, images_middleware_1.uploadSingle)(req.body.thumbnail.url);
        const images = yield (0, images_middleware_1.uploadMultiple)(req.body.images.map((item) => item.url));
        const variant = yield (yield variant_model_1.default.create(Object.assign(Object.assign({}, value), { thumbnail, images }))).populate({
            path: 'color',
            select: '-_id name vnName value',
            options: {
                lean: true,
            },
        });
        yield product_model_1.default.findByIdAndUpdate(product_id, {
            $push: {
                variants: variant._id,
            },
        }).lean();
        response_handler_1.default.created(res, {
            variant,
            message: {
                vi: 'Thêm biến thể thành công',
                en: 'Successfully added variant',
            },
        });
    }
    catch (err) {
        response_handler_1.default.error(res);
    }
});
exports.create = create;
const updateOne = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const _id = req.params.id;
    const values = req.body;
    try {
        if (values.thumbnail.public_id.slice(0, 8) !== 'nikeshop') {
            const thumbnail = yield (0, images_middleware_1.uploadSingle)(values.thumbnail.url);
            if (thumbnail) {
                values.thumbnail = thumbnail;
            }
        }
        const newImage = yield Promise.all(values.images
            .map((item) => __awaiter(void 0, void 0, void 0, function* () {
            if (item.public_id.slice(0, 8) !== 'nikeshop') {
                const newImage = yield (0, images_middleware_1.uploadSingle)(item.url);
                if (newImage)
                    return newImage;
            }
            return item;
        }))
            .filter((item) => item));
        if (newImage) {
            values.images = newImage;
        }
        const variant = yield variant_model_1.default.findByIdAndUpdate(_id, values, {
            new: true,
        }).lean();
        response_handler_1.default.created(res, {
            variant,
            message: {
                vi: 'Cập nhật biến thể thành công',
                en: 'Successfully updated variant',
            },
        });
    }
    catch (err) {
        response_handler_1.default.error(res);
    }
});
exports.updateOne = updateOne;
const deleteOne = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const _id = req.params.id;
    try {
        const order = yield order_model_1.default.find({ 'products.variant': _id });
        if (order.length > 0) {
            return response_handler_1.default.badrequest(res, {
                vi: 'Khổng thể xóa biến thể của sản phẩm đã thanh toán',
                en: 'Paid product variations cannot be deleted',
            });
        }
        yield variant_model_1.default.deleteOne({ _id });
        yield product_model_1.default.findOneAndUpdate({ variants: _id }, {
            $pull: {
                variants: _id,
            },
        }).lean();
        response_handler_1.default.ok(res, {
            message: {
                vi: 'Xóa biến thể thành công',
                en: 'Successfully deleted variant',
            },
        });
    }
    catch (err) {
        response_handler_1.default.error(res);
    }
});
exports.deleteOne = deleteOne;
const deleteImages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, images_middleware_1.destroyMultiple)(req.body.images);
        response_handler_1.default.ok(res, {});
    }
    catch (err) {
        response_handler_1.default.error(res);
    }
});
exports.deleteImages = deleteImages;
