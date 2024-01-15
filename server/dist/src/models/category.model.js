"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const categorySchema = new mongoose_1.Schema({
    name: {
        type: String,
        lowercase: true,
        trim: true,
        required: true,
    },
    vnName: {
        type: String,
        lowercase: true,
        trim: true,
        required: true,
    },
    store: {
        type: String,
        required: true,
        enum: ['shoes', 'clothing', 'accessories'],
        lowercase: true,
    },
    status: {
        type: String,
        enum: ['show', 'hide'],
        default: 'show',
    },
}, { timestamps: true });
exports.default = (0, mongoose_1.model)('Category', categorySchema);
