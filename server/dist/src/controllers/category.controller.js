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
exports.deleteOne = exports.updateOne = exports.getAll = exports.create = void 0;
const category_model_1 = __importDefault(require("../models/category.model"));
const response_handler_1 = __importDefault(require("../handlers/response.handler"));
const product_model_1 = __importDefault(require("../models/product.model"));
const create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const category = yield category_model_1.default.create(req.body);
        response_handler_1.default.created(res, {
            category,
            message: {
                vi: 'Thêm danh mục thành công',
                en: 'Successfully added category',
            },
        });
    }
    catch (_a) {
        response_handler_1.default.error(res);
    }
});
exports.create = create;
const getAll = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let filter = filterCategory(req.query.name);
    const skip = res.locals.skip;
    const limit = res.locals.limit;
    try {
        const total = yield category_model_1.default.countDocuments(filter);
        const page = skip / limit + 1 || 1;
        const lastPage = Math.ceil(total / limit) || 1;
        const categories = yield category_model_1.default.find(filter)
            .lean()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);
        response_handler_1.default.ok(res, { categories, page, lastPage, total });
    }
    catch (_b) {
        response_handler_1.default.error(res);
    }
});
exports.getAll = getAll;
const filterCategory = (name) => {
    let filter = {};
    if (name) {
        filter = {
            $or: [
                {
                    name: { $regex: new RegExp(name), $options: 'i' },
                },
                {
                    vnName: { $regex: new RegExp(name), $options: 'i' },
                },
            ],
        };
    }
    return filter;
};
const updateOne = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const category = yield category_model_1.default.findOneAndUpdate({ _id: req.params.id }, req.body).lean();
        response_handler_1.default.ok(res, {
            category,
            message: {
                vi: 'Cập nhật danh mục thành công',
                en: 'Successfully updated category',
            },
        });
    }
    catch (_c) {
        response_handler_1.default.error(res);
    }
});
exports.updateOne = updateOne;
const deleteOne = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const canDelete = yield product_model_1.default.find({ category: req.params.id }).lean();
        if (canDelete.length > 0) {
            return response_handler_1.default.badrequest(res, {
                vi: 'Không thể xóa danh mục đã có sản phẩm',
                en: 'Cannot delete categories that already have products',
            });
        }
        yield category_model_1.default.findByIdAndDelete(req.params.id);
        response_handler_1.default.ok(res, {
            message: {
                vi: 'Xóa danh mục thành công',
                en: 'Successfully deleted category',
            },
        });
    }
    catch (_d) {
        response_handler_1.default.error(res);
    }
});
exports.deleteOne = deleteOne;
