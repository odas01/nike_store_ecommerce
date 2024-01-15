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
const category_model_1 = __importDefault(require("../models/category.model"));
const variant_model_1 = __importDefault(require("../models/variant.model"));
const filterProduct = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let filter = {};
    const { name, store, category, price, color, size, status, gte, lte, } = req.query;
    if (name) {
        filter.name = {
            $regex: new RegExp(String(name)),
            $options: 'i',
        };
    }
    if (status) {
        filter.status = status;
    }
    if (price) {
        const priceQuery = {
            $or: price.map((item) => {
                let newItem = item.split(':').map(Number);
                if (newItem.length > 1) {
                    newItem = {
                        'prices.originalPrice': {
                            $gte: newItem[0],
                            $lte: newItem[1],
                        },
                    };
                }
                else
                    newItem = { 'prices.originalPrice': { $gte: newItem[0] } };
                return newItem;
            }),
        };
        filter = Object.assign(Object.assign({}, filter), priceQuery);
    }
    // store - category
    if (store) {
        let filterCate = {
            store: store,
        };
        if (category) {
            filterCate.name = category;
        }
        const ids = (yield category_model_1.default.find(filterCate).lean()).map((item) => item._id);
        filter.category = ids;
    }
    if (color || size) {
        let ftPColor = {};
        if (color) {
            ftPColor.color = { $in: color };
        }
        if (size) {
            ftPColor['sizes.size'] = { $in: size };
        }
        const productColors = (yield variant_model_1.default.find(ftPColor).lean()).map((item) => item._id);
        filter.variants = {
            $in: productColors,
        };
    }
    if (gte) {
        let [key, value] = gte.split(':');
        filter[key] = {
            $gte: value,
        };
    }
    res.locals.filter = filter;
    next();
});
exports.default = filterProduct;
