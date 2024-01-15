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
exports.resetPassword = exports.forgotPassword = exports.adminChangePassword = exports.changePassword = exports.authChecker = exports.refreshToken = exports.googleLogin = exports.adminLogin = exports.adminSignup = exports.login = exports.signup = void 0;
const axios_1 = __importDefault(require("axios"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = __importDefault(require("../models/user.model"));
const response_handler_1 = __importDefault(require("../handlers/response.handler"));
const sendMail_1 = require("../config/sendMail");
const generateTokens = (payload) => {
    const accessToken = jsonwebtoken_1.default.sign(payload, process.env.JWT_ACCESS_KEY || 'access_key', {
        expiresIn: '1d',
    });
    const refreshToken = jsonwebtoken_1.default.sign(payload, process.env.JWT_REFRESH_KEY || 'refresh_key', {
        expiresIn: '30d',
    });
    return { accessToken, refreshToken };
};
// register
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const foundUser = yield user_model_1.default.findOne({
            email: req.body.email,
            role: 'customer',
        }).lean();
        // check account exists
        if (foundUser)
            return response_handler_1.default.badrequest(res, {
                vi: 'Email đã tồn tại',
                en: 'Email is already in use',
            });
        // resgis success
        const user = yield user_model_1.default.create(req.body);
        response_handler_1.default.created(res, {
            user,
            message: {
                vi: 'Đăng kí thành công',
                en: 'Successfully registered account',
            },
        });
    }
    catch (_a) {
        response_handler_1.default.error(res);
    }
});
exports.signup = signup;
// login
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_model_1.default.findOne({
            email: req.body.email,
            role: 'customer',
        }).lean();
        // check account exists
        if (!user)
            return response_handler_1.default.badrequest(res, {
                vi: 'Tài khoản không tồn tại',
                en: 'Email does not exist',
            });
        if (user.status === 'blocked')
            return response_handler_1.default.badrequest(res, {
                vi: 'Tài khoản của bạn đã bị khóa',
                en: 'Your account has been blocked',
            });
        // check password
        const passwordValid = bcrypt_1.default.compareSync(req.body.password, user.password);
        if (!passwordValid)
            return response_handler_1.default.badrequest(res, {
                vi: 'Sai mật khẩu',
                en: 'Incorret password',
            });
        // login success
        const token = generateTokens({ id: user._id });
        response_handler_1.default.ok(res, {
            token,
            user,
            message: {
                vi: `Chào mừng ${user.name} đến với Nike Store`,
                en: `Welcome ${user.name} to Nike Store`,
            },
        });
    }
    catch (_b) {
        response_handler_1.default.error(res);
    }
});
exports.login = login;
// admin signup
const adminSignup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_model_1.default.findOne({ email: req.body.email });
        // check account exists
        if (user)
            return response_handler_1.default.badrequest(res, {
                vi: 'Email đã tồn tại',
                en: 'Email is already in use',
            });
        // resgis success
        const newUser = yield user_model_1.default.create(Object.assign(Object.assign({}, req.body), { role: 'admin' }));
        response_handler_1.default.created(res, {
            user: newUser,
            message: {
                vi: 'Tạo tài khoản thành công',
                en: 'Successfully created acount',
            },
        });
    }
    catch (_c) {
        response_handler_1.default.error(res);
    }
});
exports.adminSignup = adminSignup;
// admin login
const adminLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_model_1.default.findOne({
            email: req.body.email,
            role: ['admin', 'root'],
        }).lean();
        // check account exists
        if (!user)
            return response_handler_1.default.badrequest(res, {
                vi: 'Tài khoản không tồn tại',
                en: 'Email does not exist',
            });
        // check password
        const passwordValid = bcrypt_1.default.compareSync(req.body.password, user === null || user === void 0 ? void 0 : user.password);
        if (!passwordValid)
            return response_handler_1.default.badrequest(res, {
                vi: 'Sai mật khẩu',
                en: 'Incorret password',
            });
        // login
        const token = generateTokens({ id: user._id });
        response_handler_1.default.ok(res, {
            token,
            user,
            message: {
                vi: `Đăng nhập quản trị viên thành công`,
                en: `Admin login successful`,
            },
        });
    }
    catch (_d) {
        response_handler_1.default.error(res);
    }
});
exports.adminLogin = adminLogin;
const googleLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const bearerHeader = req.headers['authorization'];
    const accessToken = bearerHeader === null || bearerHeader === void 0 ? void 0 : bearerHeader.split(' ')[1];
    axios_1.default
        .get('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    })
        .then(({ data }) => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield user_model_1.default.findOne({ email: data.email });
        if (user) {
            const token = generateTokens({ id: user._id });
            response_handler_1.default.ok(res, { token, user });
        }
        else {
            // resgis success
            const newUser = yield user_model_1.default.create({
                name: data.name,
                email: data.email,
                avatar: {
                    public_id: '',
                    url: data.picture,
                },
            });
            const token = generateTokens({ id: newUser._id });
            response_handler_1.default.ok(res, { token, user: newUser });
        }
    }))
        .catch(() => {
        response_handler_1.default.badrequest(res, {
            vi: 'Sai token!',
            en: 'Invalid access token!',
        });
    });
});
exports.googleLogin = googleLogin;
// refresh token
const refreshToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const refreshToken = req.body.token;
    if (!refreshToken) {
        response_handler_1.default.unauthorize(res);
    }
    jsonwebtoken_1.default.verify(refreshToken, process.env.JWT_REFRESH_KEY || 'refresh_key', (err, user) => {
        if (err)
            return response_handler_1.default.unauthorize(res);
        // create new token
        const newToken = generateTokens({ id: user.id });
        response_handler_1.default.ok(res, Object.assign({}, newToken));
    });
});
exports.refreshToken = refreshToken;
const authChecker = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = res.locals.user;
    response_handler_1.default.ok(res, {
        user,
        role: user.role,
    });
});
exports.authChecker = authChecker;
const changePassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const currentUser = res.locals.user;
    const { currentPass, newPass } = req.body;
    const passwordValid = bcrypt_1.default.compareSync(currentPass, currentUser.password);
    if (!passwordValid)
        return response_handler_1.default.badrequest(res, {
            vi: 'Mật khẩu hiện tại sai',
            en: 'Current password is wrong',
        });
    const salt = yield bcrypt_1.default.genSalt(10);
    const password = yield bcrypt_1.default.hash(newPass, salt);
    yield user_model_1.default.findByIdAndUpdate(currentUser._id, { password }, { new: true }).lean();
    response_handler_1.default.ok(res, {
        message: {
            vi: 'Đổi mật khẩu thành công',
            en: 'Changed password successfully',
        },
    });
});
exports.changePassword = changePassword;
const adminChangePassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, newPassword } = req.body;
    const salt = yield bcrypt_1.default.genSalt(10);
    const password = yield bcrypt_1.default.hash(newPassword, salt);
    yield user_model_1.default.findByIdAndUpdate(userId, { password }, { new: true }).lean();
    response_handler_1.default.ok(res, {
        message: {
            vi: 'Đổi mật khẩu thành công',
            en: 'Changed password successfully',
        },
    });
});
exports.adminChangePassword = adminChangePassword;
const forgotPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    if (!email) {
        return response_handler_1.default.badrequest(res, {
            vi: 'Thiếu email',
            en: "'Missing email'",
        });
    }
    const foundUser = yield user_model_1.default.findOne({ email }).lean();
    if (!foundUser) {
        return response_handler_1.default.badrequest(res, {
            vi: 'Tài khoản không tồn tại',
            en: 'Email does not exist',
        });
    }
    const token = jsonwebtoken_1.default.sign({ id: foundUser._id }, process.env.JWT_FORGOT_KEY || 'key', { expiresIn: '1d' });
    yield (0, sendMail_1.sendMailForgotPassword)(email, foundUser._id, token);
    response_handler_1.default.ok(res, {
        message: {
            vi: 'Kiểm tra email của bạn',
            en: 'Check your email',
        },
    });
});
exports.forgotPassword = forgotPassword;
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, token } = req.params;
    const { password } = req.body;
    jsonwebtoken_1.default.verify(token, process.env.JWT_FORGOT_KEY || 'key', (err) => __awaiter(void 0, void 0, void 0, function* () {
        if (err)
            return response_handler_1.default.badrequest(res, {
                vi: 'Sai token',
                en: 'Invalid access token!',
            });
        // create new token
        const salt = yield bcrypt_1.default.genSalt(10);
        const newPassword = yield bcrypt_1.default.hash(password, salt);
        const user = yield user_model_1.default.findByIdAndUpdate(id, { password: newPassword }, { new: true }).lean();
        response_handler_1.default.ok(res, {
            message: {
                vi: 'Đặt lại mật khẩu thành công',
                en: 'Reset the password successfully',
            },
        });
    }));
});
exports.resetPassword = resetPassword;
