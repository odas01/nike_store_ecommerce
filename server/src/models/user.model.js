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
const mongoose_1 = require("mongoose");
const bcrypt_1 = __importDefault(require("bcrypt"));
const schema = new mongoose_1.Schema({
    name: {
        type: String,
        trim: true,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        trim: true,
        required: true,
    },
    password: {
        type: String,
        trim: true,
    },
    phone: {
        type: String,
        trim: true,
    },
    address: {
        type: String,
        trim: true,
    },
    avatar: {
        public_id: {
            type: String,
        },
        url: {
            type: String,
        },
    },
    role: {
        type: String,
        enum: ['root', 'admin', 'customer'],
        default: 'customer',
    },
    status: {
        type: String,
        enum: ['active', 'blocked', 'deleted'],
        default: 'active',
    },
}, {
    toJSON: {
        transform: (_, obj) => {
            delete obj.password;
            delete obj.__v;
        },
    },
    timestamps: true,
});
schema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        const salt = yield bcrypt_1.default.genSalt(10);
        if (this.password) {
            this.password = yield bcrypt_1.default.hash(this.password, salt);
        }
        next();
    });
});
exports.default = (0, mongoose_1.model)('User', schema);
