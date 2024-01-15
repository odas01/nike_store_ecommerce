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
const size_model_1 = __importDefault(require("../models/size.model"));
const response_handler_1 = __importDefault(require("../handlers/response.handler"));
const create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const size = yield size_model_1.default.create(req.body);
        response_handler_1.default.created(res, {
            size,
            message: {
                vi: 'Thêm kích thước thành công',
                en: 'Successfully added size',
            },
        });
    }
    catch (_a) {
        response_handler_1.default.error(res);
    }
});
exports.create = create;
const getAll = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name } = req.query;
    const filter = name
        ? {
            name: { $regex: new RegExp(String(name)), $options: 'i' },
        }
        : {};
    const skip = res.locals.skip;
    const limit = res.locals.limit;
    try {
        const total = yield size_model_1.default.countDocuments(filter);
        const page = skip / limit + 1 || 1;
        const lastPage = Math.ceil(total / limit) || 1;
        const sizes = yield size_model_1.default.find(filter)
            .lean()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);
        response_handler_1.default.ok(res, { sizes, page, lastPage, total });
    }
    catch (_b) {
        response_handler_1.default.error(res);
    }
});
exports.getAll = getAll;
const updateOne = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        const size = yield size_model_1.default.findByIdAndUpdate(id, req.body).lean();
        response_handler_1.default.created(res, {
            size,
            message: {
                vi: 'Cập nhật kích thước thành công',
                en: 'Successfully updated size',
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
        yield size_model_1.default.findByIdAndDelete(id).lean();
        response_handler_1.default.created(res, {
            message: {
                vi: 'Xóa kích thước thành công',
                en: 'Successfully deleted size',
            },
        });
    }
    catch (_d) {
        response_handler_1.default.error(res);
    }
});
exports.deleteOne = deleteOne;
