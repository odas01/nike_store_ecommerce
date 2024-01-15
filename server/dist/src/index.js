"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
require("dotenv/config");
const http = require('http');
const routes_1 = __importDefault(require("./routes"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json({ limit: '100mb' }));
app.use(express_1.default.urlencoded({ limit: '100mb', extended: true }));
app.use('/api', routes_1.default);
const server = http.createServer(app);
const PORT = process.env.PORT || 3000;
const MONGOURL = process.env.MONGODB_URL || 'mongodb://127.0.0.1:27017/nikeshoes';
mongoose_1.default
    .connect(MONGOURL)
    .then(() => {
    console.log('Connect to MongoDB successfully!!!');
    server.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));
})
    .catch((err) => {
    console.log({ err });
    process.exit(1);
});
