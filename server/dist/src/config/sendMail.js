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
exports.sendMultipleEmail = exports.sendMailForgotPassword = exports.sendMailOrder = void 0;
const moment_1 = __importDefault(require("moment"));
const nodemailer_1 = __importDefault(require("nodemailer"));
let transporter = nodemailer_1.default.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_NAME,
        pass: process.env.EMAIL_APP_PASSWORD,
    },
    tls: {
        rejectUnauthorized: false,
    },
});
const sendMailOrder = (email) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield transporter.sendMail({
            from: 'lntthanh3317@gmail.com',
            to: email,
            subject: 'Nike store',
            text: 'Chúng tôi rất vui mừng khi bạn đã tin tưởng và sử dụng sản phẩm của cửa hàng/công ty. Nếu có bất cứ điều gì thắc mắc hoặc cần hỗ trợ, vui lòng phản hồi để chúng tôi biết và giúp bạn có những trải nghiệm tuyệt vời nhất với sản phẩm của chúng tôi',
        });
    }
    catch (err) {
        console.log(err);
    }
});
exports.sendMailOrder = sendMailOrder;
const sendMailForgotPassword = (email, userId, token) => __awaiter(void 0, void 0, void 0, function* () {
    yield transporter.sendMail({
        from: process.env.EMAIL_NAME,
        to: email,
        subject: 'Reset your password',
        text: `http://localhost:3001/reset-password/${userId}/${token}`,
    });
});
exports.sendMailForgotPassword = sendMailForgotPassword;
const sendMultipleEmail = (emails, name, code, value, exprire) => __awaiter(void 0, void 0, void 0, function* () {
    const date = (0, moment_1.default)(exprire).format('DD/MM YYYY');
    yield transporter.sendMail({
        from: process.env.EMAIL_NAME,
        to: emails,
        subject: 'Giảm giá: ' + name,
        html: ` 
      <h2>
      <b>Nike store xin gửi đến quý khách mã giảm giá mới</b> 
      </h2>
      <p>Mã giảm: ${code}</p>
      <p>Giá trị: ${value}</p>
      <p>Ngày hết hạn: ${date} </p>`,
    });
});
exports.sendMultipleEmail = sendMultipleEmail;
