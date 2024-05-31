"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Role = void 0;
const CustomError_1 = __importDefault(require("@utils/CustomError"));
const http_status_codes_1 = require("http-status-codes");
const lodash_1 = require("lodash");
const Logger_1 = __importDefault(require("@utils/LoggerFactory/Logger"));
/**
 *
 * @param {string} roles
 * @returns
 */
const Role = (...roles) => {
    return (req, _, next) => {
        Logger_1.default.info(`Verifying user role, User ID: ${req.user?.id}`);
        if (!(0, lodash_1.isEmpty)(req.user)) {
            if (!roles.includes(req.user.role)) {
                Logger_1.default.error(`User not activated seller account, UserId: ${req.user.id} `);
                next(new CustomError_1.default('You need to activate the seller account', http_status_codes_1.StatusCodes.FORBIDDEN, false));
            }
            Logger_1.default.info(`User role verification successfull, Seller ID: ${req.user?.id}`);
            next();
        }
    };
};
exports.Role = Role;
//# sourceMappingURL=roles.js.map