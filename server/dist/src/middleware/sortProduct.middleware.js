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
const sortProduct = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let sort;
    // sort
    if (req.query.sort) {
        const [key, value] = String(req.query.sort).split(':');
        sort = {
            [key]: Number(value),
        };
    }
    else {
        sort = {
            createdAt: -1,
        };
    }
    res.locals.sort = sort;
    next();
});
exports.default = sortProduct;
