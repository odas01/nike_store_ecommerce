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
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth = __importStar(require("../controllers/auth.controller"));
const verify_middleware_1 = require("../middleware/verify.middleware");
const router = (0, express_1.Router)();
router.post('/login', auth.login);
router.post('/signup', auth.signup);
router.post('/admin/login', auth.adminLogin);
router.post('/admin/signup', verify_middleware_1.checkAuth, verify_middleware_1.verifyRoot, auth.adminSignup);
router.post('/admin/change-password', verify_middleware_1.checkAuth, auth.adminChangePassword);
router.post('/change-password', verify_middleware_1.checkAuth, auth.changePassword);
router.post('/forgot-password', auth.forgotPassword);
router.post('/reset-password/:id/:token', auth.resetPassword);
router.post('/googleLogin', auth.googleLogin);
router.get('/authChecker', verify_middleware_1.checkAuth, auth.authChecker);
router.post('/refreshToken', auth.refreshToken);
exports.default = router;
