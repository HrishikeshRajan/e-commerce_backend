"use strict";
/* eslint-disable @typescript-eslint/no-misused-promises */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDatabaseConnection = void 0;
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const userRouter_1 = __importDefault(require("@routes/userRouter"));
const productRouter_1 = __importDefault(require("@routes/productRouter"));
const adminRouter_1 = __importDefault(require("@routes/adminRouter"));
const sellerRouter_1 = __importDefault(require("@routes/sellerRouter"));
const cartRouter_1 = __importDefault(require("@routes/cartRouter"));
const orderRouter_1 = __importDefault(require("@routes/orderRouter"));
const reviewRouter_1 = __importDefault(require("@routes/reviewRouter"));
const error_handler_1 = require("./middlewares/error.handler");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cloudinary_config_1 = __importDefault(require("./configs/cloudinary.config"));
const express_session_1 = __importDefault(require("express-session"));
const database_services_1 = __importDefault(require("./services/database.services"));
const databaseSingleton_config_1 = __importDefault(require("./configs/databaseSingleton.config"));
// import deserializeUser from './middlewares/deserializeUser'
const compression_1 = __importDefault(require("compression"));
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
require("module-alias/register");
dotenv_1.default.config();
dotenv_1.default.config({ path: '.env.test' });
const app = (0, express_1.default)();
app.use((0, morgan_1.default)('tiny'));
// const whitelist = (process.env.WHITELIST_URL as string).split(';')
// const corsOptions: CorsOptions = {
//   origin: (origin: string | undefined, callback: (err: Error | null, status?: boolean) => void) => {
//     if (!origin || whitelist.indexOf(origin) !== -1) {
//       callback(null, true);
//     } else {
//       callback(new Error('Not allowed by CORS'));
//     }
//   },
//   credentials: true,
// };
app.use((0, cors_1.default)({
    origin: true,
    credentials: true
}));
app.use((0, compression_1.default)());
app.use((0, helmet_1.default)());
app.use(express_1.default.json({
    verify: function (req, res, buf) {
        if (req.originalUrl?.endsWith('/webhook')) {
            req.rawBody = buf.toString();
        }
    },
}));
// app.use(express.json())
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
app.use((0, express_session_1.default)({
    resave: false,
    saveUninitialized: false,
    secret: process.env.SESSION_SECRET_DEV
}));
//Here we configure the cloudinary keys
app.use('*', cloudinary_config_1.default);
//Here we handle the JWT token validation
// app.use(deserializeUser)
// Cloudinary is configured for all routes
// app.engine('handlebars', engine())
// app.set('view engine', 'handlebars')
// app.set('views', './src/views')
// app.use(express.static(path.join(__dirname, '/src/public')))
// app.enable('trust proxy');
// Route API
app.use('/api/v1/users/', userRouter_1.default);
app.use('/api/v1/product/', productRouter_1.default);
app.use('/api/v1/admin/', adminRouter_1.default);
app.use('/api/v1/seller/', sellerRouter_1.default);
app.use('/api/v1/cart/', cartRouter_1.default);
app.use('/api/v1/orders/', orderRouter_1.default);
app.use('/api/v1/review/', reviewRouter_1.default);
// This will catch the unmatched routes and forward to error handler 
app.use(error_handler_1.notFound);
const createDatabaseConnection = async (url) => {
    const databaseService = new database_services_1.default();
    // eslint-disable-next-line @typescript-eslint/no-confusing-void-expression
    await databaseService.connectDatabase(databaseSingleton_config_1.default.getInstance(), url);
};
exports.createDatabaseConnection = createDatabaseConnection;
/*
  Here we handle production error
*/
// if(process.env.NODE_ENV === 'production'){
//   app.use(errorHandlerV2)
// }
// app.use(errorHandler)
app.use(error_handler_1.errorHandlerV2);
exports.default = app;
//# sourceMappingURL=index.js.map