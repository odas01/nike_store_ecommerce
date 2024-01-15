"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const sizeSchema = new mongoose_1.Schema({
    name: {
        type: String,
        lowercase: true,
        trim: true,
        required: true,
    },
    store: {
        type: String,
        enum: ['shoes', 'clothing', 'accessories'],
        required: true,
    },
}, { timestamps: true });
exports.default = (0, mongoose_1.model)('Size', sizeSchema);
