"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const schema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
    },
    code: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    value: {
        type: Number,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    expirationDate: {
        type: Date,
        default: () => new Date(+new Date() + 3 * 24 * 60 * 60 * 1000),
    },
}, { timestamps: true });
exports.default = (0, mongoose_1.model)('Coupon', schema);
