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
exports.verifyRoot = exports.verifyAdminRoot = exports.checkAuth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = __importDefault(require("../models/user.model"));
const response_handler_1 = __importDefault(require("../handlers/response.handler"));
const tokenDecode = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const bearerHeader = req.headers['authorization'];
    if (bearerHeader) {
        const bearer = bearerHeader.split(' ')[1];
        try {
            const tokenDecoded = jsonwebtoken_1.default.verify(bearer, process.env.JWT_ACCESS_KEY || 'access_key');
            return tokenDecoded;
        }
        catch (_a) {
            return false;
        }
    }
    else {
        return false;
    }
});
const checkAuth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const tokenDecoded = yield tokenDecode(req);
    if (tokenDecoded) {
        const user = yield user_model_1.default.findById(tokenDecoded.id).lean();
        if (!user)
            return response_handler_1.default.unauthorize(res);
        res.locals.user = user;
        next();
    }
    else
        return response_handler_1.default.unauthorize(res);
});
exports.checkAuth = checkAuth;
const verifyAdminRoot = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const role = res.locals.user.role;
    if (role === 'customer')
        return response_handler_1.default.unauthorize(res);
    next();
});
exports.verifyAdminRoot = verifyAdminRoot;
const verifyRoot = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const role = res.locals.user.role;
    if (role === 'customer' || role === 'admin')
        return response_handler_1.default.unauthorize(res);
    next();
});
exports.verifyRoot = verifyRoot;
