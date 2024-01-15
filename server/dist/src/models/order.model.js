"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const schema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
    },
    coupon: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Coupon',
    },
    phone: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    discount: {
        type: Number,
        required: true,
    },
    total: {
        type: Number,
        required: true,
    },
    subTotal: {
        type: Number,
        required: true,
    },
    products: [
        {
            _id: false,
            product: {
                type: mongoose_1.Schema.Types.ObjectId,
                ref: 'Product',
            },
            variant: {
                type: mongoose_1.Schema.Types.ObjectId,
                ref: 'Variant',
            },
            rating: {
                type: mongoose_1.Schema.Types.ObjectId,
                ref: 'Rating',
                default: null,
            },
            name: {
                type: String,
                required: true,
            },
            thumbnail: {
                type: String,
                required: true,
            },
            price: {
                type: Number,
                required: true,
            },
            qty: {
                type: Number,
                required: true,
            },
            size: {
                type: String,
                required: true,
            },
            isRating: {
                type: Boolean,
                requried: true,
                default: false,
            },
        },
    ],
    message: {
        type: String,
        defautl: 'No message',
    },
    paymentMethod: {
        type: String,
        enum: ['cash', 'paypal', 'vnpay'],
        default: 'cash',
    },
    shippingCost: {
        type: Number,
        required: true,
    },
    paid: {
        type: Boolean,
        default: false,
    },
    status: {
        type: String,
        enum: ['pending', 'processing', 'cancel', 'delivered'],
        default: 'pending',
        lowercase: true,
    },
}, { timestamps: true });
exports.default = (0, mongoose_1.model)('Order', schema);
