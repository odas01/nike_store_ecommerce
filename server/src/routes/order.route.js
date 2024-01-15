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
const express_1 = require("express");
const order = __importStar(require("../controllers/order.controller"));
const verify_middleware_1 = require("../middleware/verify.middleware");
const skipLimit_middleware_1 = __importDefault(require("../middleware/skipLimit.middleware"));
const router = (0, express_1.Router)();
router
    .route('/')
    .get(skipLimit_middleware_1.default, verify_middleware_1.checkAuth, order.getAll)
    .post(verify_middleware_1.checkAuth, order.create);
router.route('/create-payment').post(verify_middleware_1.checkAuth, order.vnPay, order.create);
router.route('/dashboard-count').get(verify_middleware_1.checkAuth, order.dashboardCount);
router.route('/dashboard-amount').get(order.dashboardAmount);
router.route('/dashboard-chart').get(verify_middleware_1.checkAuth, order.dashboardChart);
router
    .route('/:id')
    .get(verify_middleware_1.checkAuth, order.getOne)
    .put(verify_middleware_1.checkAuth, order.updateOne)
    .delete(verify_middleware_1.checkAuth, verify_middleware_1.verifyAdminRoot, order.deleteOne);
exports.default = router;
