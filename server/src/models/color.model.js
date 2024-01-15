"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const colorSchema = new mongoose_1.Schema({
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
    value: {
        type: String,
        required: true,
        lowercase: true,
    },
}, { timestamps: true });
exports.default = (0, mongoose_1.model)('Color', colorSchema);
