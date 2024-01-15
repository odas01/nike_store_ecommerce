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
const color_model_1 = __importDefault(require("../models/color.model"));
const response_handler_1 = __importDefault(require("../handlers/response.handler"));
const variant_model_1 = __importDefault(require("../models/variant.model"));
const create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const color = yield color_model_1.default.create(req.body);
        response_handler_1.default.created(res, {
            color,
            message: {
                vi: 'Thêm màu sắc thành công',
                en: 'Successfully added color',
            },
        });
    }
    catch (_a) {
        response_handler_1.default.error(res);
    }
});
exports.create = create;
const getAll = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filter = req.query.name
        ? {
            $or: [
                {
                    name: {
                        $regex: new RegExp(String(req.query.name)),
                        $options: 'i',
                    },
                },
                {
                    vnName: {
                        $regex: new RegExp(String(req.query.name)),
                        $options: 'i',
                    },
                },
            ],
        }
        : {};
    const skip = res.locals.skip || 0;
    const limit = res.locals.limit || 15;
    try {
        const total = yield color_model_1.default.countDocuments(filter);
        const page = skip / limit + 1 || 1;
        const lastPage = Math.ceil(total / limit) || 1;
        const colors = yield color_model_1.default.find(filter)
            .lean()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);
        response_handler_1.default.ok(res, { colors, page, lastPage, total });
    }
    catch (_b) {
        response_handler_1.default.error(res);
    }
});
exports.getAll = getAll;
const updateOne = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        const color = yield color_model_1.default.findByIdAndUpdate(id, req.body, {
            new: true,
        }).lean();
        response_handler_1.default.ok(res, {
            color,
            message: {
                vi: 'Cập nhật màu sắc thành công',
                en: 'Successfully updated color',
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
        const canDelete = yield variant_model_1.default.find({ color: req.params.id }).lean();
        if (canDelete.length > 0) {
            return response_handler_1.default.badrequest(res, {
                vi: 'Không thể xóa màu sắc đã sử dụng',
                en: 'Cannot delete colors that already used',
            });
        }
        yield color_model_1.default.findByIdAndDelete(id).lean();
        response_handler_1.default.ok(res, {
            message: {
                vi: 'Xóa màu sắc thành công',
                en: 'Successfully deleted color',
            },
        });
    }
    catch (_d) {
        response_handler_1.default.error(res);
    }
});
exports.deleteOne = deleteOne;
