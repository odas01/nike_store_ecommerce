"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const schema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    product: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
    },
    variant: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Variant',
        required: true,
    },
    size: {
        type: String,
        required: true,
    },
    qty: {
        type: Number,
        required: true,
    },
}, { timestamps: true });
exports.default = (0, mongoose_1.model)('CartItem', schema);
