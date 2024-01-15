"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const schema = new mongoose_1.Schema({
    product: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
    },
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    order: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Order',
        required: true,
    },
    rate: {
        type: Number,
        min: 0,
        max: 5,
        default: 5,
    },
    comment: {
        type: String,
        default: '',
    },
    isShow: {
        type: Boolean,
        default: true,
    },
}, { timestamps: true });
exports.default = (0, mongoose_1.model)('Rating', schema);
