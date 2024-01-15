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
exports.count = exports.similar = exports.deleteOne = exports.updateOne = exports.getOne = exports.getAll = exports.create = void 0;
const product_model_1 = __importDefault(require("../models/product.model"));
const response_handler_1 = __importDefault(require("../handlers/response.handler"));
const images_middleware_1 = require("../middleware/images.middleware");
const variant_model_1 = __importDefault(require("../models/variant.model"));
const order_model_1 = __importDefault(require("../models/order.model"));
const slugify_1 = __importDefault(require("slugify"));
const createVariant = (variants) => __awaiter(void 0, void 0, void 0, function* () {
    const thumbnail = yield (0, images_middleware_1.uploadSingle)(variants.thumbnail.url);
    const images = yield (0, images_middleware_1.uploadMultiple)(variants.images.map((image) => image.url));
    return yield variant_model_1.default.create(Object.assign(Object.assign({}, variants), { thumbnail,
        images }));
});
const create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const _a = req.body, { color, sizes, thumbnail, price, images } = _a, value = __rest(_a, ["color", "sizes", "thumbnail", "price", "images"]);
    try {
        const foundProduct = yield product_model_1.default.findOne({ name: value.name });
        if (foundProduct) {
            return response_handler_1.default.badrequest(res, {
                vi: 'Tên sản phẩm đã tồn tại',
                en: 'Product name already exists',
            });
        }
        const variant = yield createVariant({
            color,
            sizes,
            thumbnail,
            images,
        });
        const product = yield product_model_1.default.create(Object.assign(Object.assign({}, value), { variants: [variant._id] }));
        response_handler_1.default.created(res, {
            product,
            message: {
                vi: 'Thêm sản phẩm thành công',
                en: 'Successfully added product',
            },
        });
    }
    catch (err) {
        response_handler_1.default.error(res);
    }
});
exports.create = create;
const getAll = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const skip = res.locals.skip;
    const limit = res.locals.limit;
    try {
        const total = yield product_model_1.default.countDocuments(res.locals.filter);
        const page = skip / limit + 1 || 1;
        const lastPage = Math.ceil(total / limit) || 1;
        const products = yield product_model_1.default.find(res.locals.filter)
            .populate([
            {
                path: 'category',
                select: 'name vnName store',
                options: { lean: true },
            },
            {
                path: 'variants',
                options: { lean: true },
                populate: {
                    path: 'color',
                    select: 'name vnName value',
                    options: { lean: true },
                },
            },
        ])
            .lean()
            .sort(res.locals.sort)
            .skip(skip)
            .limit(limit);
        response_handler_1.default.ok(res, { products, page, lastPage, total });
    }
    catch (err) {
        response_handler_1.default.error(res);
    }
});
exports.getAll = getAll;
const getOne = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const slug = req.params.slug;
    const status = req.query.status;
    const filter = {
        slug,
    };
    if (status) {
        filter.status = status;
    }
    try {
        const product = yield product_model_1.default.findOne(filter)
            .lean()
            .populate({
            path: 'category',
            select: '-_id name vnName store',
        })
            .populate({
            path: 'variants',
            populate: {
                path: 'color',
                select: '-_id name vnName value',
            },
        });
        if (!product) {
            return response_handler_1.default.notfound(res);
        }
        response_handler_1.default.ok(res, product);
    }
    catch (err) {
        response_handler_1.default.error(res);
    }
});
exports.getOne = getOne;
const updateOne = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { slug } = req.params;
    try {
        if (req.body.name) {
            const foundProduct = yield product_model_1.default.findOne({ name: req.body.name });
            if (foundProduct) {
                return response_handler_1.default.badrequest(res, {
                    vi: 'Tên sản phẩm đã tồn tại',
                    en: 'Product name already exists',
                });
            }
            const foundProduct2 = yield product_model_1.default.findOne({ slug }).lean();
            if (foundProduct2 && foundProduct2.name !== req.body.name) {
                req.body.slug = (0, slugify_1.default)(req.body.name, {
                    lower: true,
                });
            }
        }
        const product = yield product_model_1.default.findOneAndUpdate({ slug }, req.body, {
            new: true,
        }).lean();
        return response_handler_1.default.ok(res, {
            product,
            message: {
                vi: 'Cập nhật sản phẩm thành công',
                en: 'Successfully updated product',
            },
        });
    }
    catch (err) {
        response_handler_1.default.error(res);
    }
});
exports.updateOne = updateOne;
const deleteOne = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const _id = req.params.slug;
    try {
        const order = yield order_model_1.default.find({ 'products.product': _id }).lean();
        if (order.length > 0) {
            return response_handler_1.default.badrequest(res, {
                vi: 'Khổng thể xóa sản phẩm đã thanh toán',
                en: 'Paid products cannot be deleted',
            });
        }
        const product = yield product_model_1.default.findByIdAndDelete({ _id }).lean();
        yield variant_model_1.default.deleteMany({
            _id: {
                $in: product === null || product === void 0 ? void 0 : product.variants,
            },
        });
        response_handler_1.default.ok(res, {
            message: {
                vi: 'Xóa sản phẩm thành công',
                en: 'Successfully deleted product',
            },
        });
    }
    catch (err) {
        response_handler_1.default.error(res);
    }
});
exports.deleteOne = deleteOne;
const similar = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { slug } = req.params;
    res.locals.filter.slug = { $ne: slug };
    next();
});
exports.similar = similar;
const count = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const count = yield product_model_1.default.countDocuments({});
        response_handler_1.default.ok(res, { count });
    }
    catch (err) {
        response_handler_1.default.error(res);
    }
});
exports.count = count;
