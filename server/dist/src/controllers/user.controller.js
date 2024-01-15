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
exports.count = exports.deleteOne = exports.updateOne = exports.getOne = exports.getAll = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const response_handler_1 = __importDefault(require("../handlers/response.handler"));
const images_middleware_1 = require("../middleware/images.middleware");
const filterUser = (query) => {
    const { role, search } = query;
    let filter = {};
    if (role)
        filter.role = role;
    if (search)
        filter = Object.assign(Object.assign({}, filter), { $or: [
                { name: { $regex: new RegExp(search), $options: 'i' } },
                { phone: { $regex: new RegExp(search), $options: 'i' } },
                { email: { $regex: new RegExp(search), $options: 'i' } },
            ] });
    filter.status = {
        $ne: 'deleted',
    };
    return filter;
};
const getAll = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { role } = req.query;
    const filter = filterUser(req.query);
    const skip = res.locals.skip;
    const limit = res.locals.limit;
    try {
        const total = yield user_model_1.default.countDocuments(role ? { role } : {});
        const page = skip / limit + 1 || 1;
        const lastPage = Math.ceil(total / limit) || 1;
        const users = yield user_model_1.default.find(filter)
            .lean()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);
        response_handler_1.default.ok(res, { users, page, lastPage, total });
    }
    catch (_a) {
        response_handler_1.default.error(res);
    }
});
exports.getAll = getAll;
const getOne = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_model_1.default.findById(req.params.id)
            .lean()
            .select('-password');
        if (!user)
            return response_handler_1.default.notfound(res);
        response_handler_1.default.ok(res, user);
    }
    catch (_b) {
        response_handler_1.default.error(res);
    }
});
exports.getOne = getOne;
const updateOne = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const _c = req.body, { role, email, avatar } = _c, values = __rest(_c, ["role", "email", "avatar"]);
    const currentUser = res.locals.user;
    try {
        const foundUser = yield user_model_1.default.findOne({
            _id: { $ne: req.params.id },
            email,
            role,
        }).lean();
        if (foundUser) {
            return response_handler_1.default.badrequest(res, {
                vi: 'Email đã tồn tại',
                en: 'Email already exists',
            });
        }
        if (avatar && avatar.slice(0, 4) !== 'http') {
            if (currentUser.avatar) {
                yield (0, images_middleware_1.destroySingle)(currentUser.avatar.public_id);
            }
            values.avatar = yield (0, images_middleware_1.uploadSingle)(avatar, 'account');
        }
        const user = yield user_model_1.default.findByIdAndUpdate(req.params.id, Object.assign(Object.assign({}, values), { email }), { new: true }).lean();
        response_handler_1.default.ok(res, {
            user,
            message: {
                vi: 'Cập nhật thông tin thành công',
                en: 'Successfully updated information',
            },
        });
    }
    catch (_d) {
        response_handler_1.default.error(res);
    }
});
exports.updateOne = updateOne;
const deleteOne = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield user_model_1.default.findByIdAndUpdate(req.params.id, { status: 'deleted' }).lean();
        response_handler_1.default.ok(res, {
            message: {
                vi: 'Xóa người dùng thành công',
                en: 'Successfully deleted user',
            },
        });
    }
    catch (_e) {
        response_handler_1.default.error(res);
    }
});
exports.deleteOne = deleteOne;
const count = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const count = yield user_model_1.default.aggregate([
            {
                $group: {
                    _id: '$role',
                    count: { $sum: 1 },
                },
            },
            {
                $project: {
                    _id: 0,
                    role: '$_id',
                    count: 1,
                },
            },
        ]);
        response_handler_1.default.ok(res, count);
    }
    catch (_f) {
        response_handler_1.default.error(res);
    }
});
exports.count = count;
