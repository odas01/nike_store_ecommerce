"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const schema = new mongoose_1.Schema({
    color: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Color',
    },
    sizes: [
        {
            _id: false,
            size: {
                type: String,
                required: true,
            },
            stock: {
                type: Number,
                required: true,
            },
        },
    ],
    thumbnail: {
        public_id: {
            type: String,
        },
        url: {
            type: String,
            required: true,
        },
    },
    images: [
        {
            _id: false,
            public_id: {
                type: String,
            },
            url: {
                type: String,
            },
        },
    ],
});
exports.default = (0, mongoose_1.model)('Variant', schema);
