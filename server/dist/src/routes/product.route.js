"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const product = __importStar(require("../controllers/product.controller"));
const variant = __importStar(require("../controllers/variant.controller"));
const verify_middleware_1 = require("../middleware/verify.middleware");
const filterProduct_mdw_1 = __importDefault(require("../middleware/filterProduct.mdw"));
const sortProduct_middleware_1 = __importDefault(require("../middleware/sortProduct.middleware"));
const skipLimit_middleware_1 = __importDefault(require("../middleware/skipLimit.middleware"));
const router = express_1.default.Router();
router
    .route('/')
    .get(skipLimit_middleware_1.default, sortProduct_middleware_1.default, filterProduct_mdw_1.default, product.getAll)
    .post(verify_middleware_1.checkAuth, verify_middleware_1.verifyAdminRoot, product.create);
// d: detail
router
    .route('/d/:slug')
    .get(product.getOne)
    .put(verify_middleware_1.checkAuth, verify_middleware_1.verifyAdminRoot, product.updateOne)
    .delete(verify_middleware_1.checkAuth, verify_middleware_1.verifyAdminRoot, product.deleteOne);
router
    .route('/d/:slug/similar')
    .get(sortProduct_middleware_1.default, filterProduct_mdw_1.default, product.similar, product.getAll);
router
    .route('/deleteImages')
    .post(verify_middleware_1.checkAuth, verify_middleware_1.verifyAdminRoot, variant.deleteImages);
router.route('/count').get(verify_middleware_1.checkAuth, verify_middleware_1.verifyAdminRoot, product.count);
exports.default = router;
