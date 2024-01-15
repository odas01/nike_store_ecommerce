"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const slugify_1 = __importDefault(require("slugify"));
const mongoose_1 = require("mongoose");
const productSchema = new mongoose_1.Schema({
    category: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Category',
    },
    name: {
        type: String,
        trim: true,
        required: true,
    },
    slug: {
        type: String,
    },
    prices: {
        originalPrice: {
            type: Number,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
    },
    discount: {
        type: Number,
        default: 0,
    },
    genders: [
        {
            type: String,
            required: true,
            enum: ['men', 'women', 'boy', 'girl'],
        },
    ],
    desc: {
        type: String,
        default: 'No description',
    },
    variants: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'Variant',
        },
    ],
    view: {
        type: Number,
        default: 0,
    },
    sold: {
        type: Number,
        default: 0,
    },
    status: {
        type: String,
        enum: ['show', 'hide', 'deleted'],
        default: 'show',
    },
}, {
    timestamps: true,
    toJSON: {
        transform: (_, obj) => {
            delete obj.__v;
        },
    },
});
productSchema.pre('save', function (next) {
    this.slug = (0, slugify_1.default)(this.name, {
        lower: true,
    });
    next();
});
exports.default = (0, mongoose_1.model)('Product', productSchema);
