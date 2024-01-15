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
Object.defineProperty(exports, "__esModule", { value: true });
const skipLimit = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let skip = Number(req.query.skip);
    let limit = Number(req.query.limit);
    if (isNaN(skip)) {
        skip = 0;
    }
    if (isNaN(limit)) {
        limit = 15;
    }
    res.locals.skip = skip;
    res.locals.limit = limit;
    next();
});
exports.default = skipLimit;
