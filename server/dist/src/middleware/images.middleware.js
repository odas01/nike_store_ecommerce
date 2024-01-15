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
exports.destroyMultiple = exports.destroySingle = exports.uploadMultiple = exports.uploadSingle = void 0;
const cloudinary_1 = __importDefault(require("../config/cloudinary"));
const folderName = 'nikeshop';
const uploadSingle = (file, folder = 'product') => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { public_id, url } = yield cloudinary_1.default.uploader.upload(file, {
            folder: folderName + '/' + folder,
        });
        return { public_id, url };
    }
    catch (err) {
        console.log(err);
    }
});
exports.uploadSingle = uploadSingle;
const uploadMultiple = (files) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const results = yield Promise.all(files.map((file) => (0, exports.uploadSingle)(file)));
        return results;
    }
    catch (err) {
        console.log(err);
    }
});
exports.uploadMultiple = uploadMultiple;
const destroySingle = (public_id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield cloudinary_1.default.uploader.destroy(public_id);
        return result;
    }
    catch (err) {
        console.log(err);
    }
});
exports.destroySingle = destroySingle;
const destroyMultiple = (public_ids) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield Promise.all(public_ids.map((public_id) => (0, exports.uploadSingle)(public_id)));
    }
    catch (err) {
        console.log(err);
    }
});
exports.destroyMultiple = destroyMultiple;
