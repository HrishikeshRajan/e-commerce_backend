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
globals_1.jest.mock('@utils/LoggerFactory/DevelopmentLogger', () => ({
    __esModule: true,
    default: {
        info: globals_1.jest.fn(),
        error: globals_1.jest.fn()
    }
}));
globals_1.jest.mock('@services/user.services', () => {
    const services = globals_1.jest.fn();
    services.prototype.findUser = globals_1.jest.fn();
    services.prototype.createUser = globals_1.jest.fn(() => ({ _id: 1 }));
    return services;
});
globals_1.jest.mock('@services/jwt.services', () => {
    const services = globals_1.jest.fn();
    services.prototype.signPayload = globals_1.jest.fn();
    return services;
});
globals_1.jest.mock('@services/response.services');
const globals_1 = require("@jest/globals");
const controller = __importStar(require("../userController"));
const Logger_1 = __importDefault(require("@utils/LoggerFactory/Logger"));
const user_services_1 = __importDefault(require("@services/user.services"));
const response_services_1 = require("@services/response.services");
const jwt_services_1 = __importDefault(require("@services/jwt.services"));
const node_test_1 = require("node:test");
describe('Register Controller', () => {
    beforeEach(() => {
        process.env.JWT_SECRET = 'test';
        process.env.VERIFICATION_LINK_EXPIRY_DEV = '1m';
    });
    (0, node_test_1.afterEach)(() => {
        globals_1.jest.clearAllMocks();
    });
    it('should return a success response', async () => {
        const mReq = { body: { fullname: '', email: '', password: '' } };
        const mRes = {};
        const mNext = globals_1.jest.fn();
        await controller.registerUser(mReq, mRes, mNext);
        const response = {
            res: mRes,
            success: true,
            statusCode: 201,
            message: { message: 'An verification link has been sent to your email address' }
        };
        (0, globals_1.expect)(Logger_1.default.info).toHaveBeenCalled();
        (0, globals_1.expect)(globals_1.jest.spyOn(new user_services_1.default, 'findUser')).toHaveBeenCalled();
        (0, globals_1.expect)(globals_1.jest.spyOn(new user_services_1.default, 'createUser')).toHaveBeenCalled();
        (0, globals_1.expect)(globals_1.jest.spyOn(new jwt_services_1.default, 'signPayload')).toHaveBeenCalled();
        (0, globals_1.expect)(response_services_1.sendHTTPResponse).toHaveBeenCalledWith(response);
        (0, globals_1.expect)(response_services_1.sendHTTPResponse).toHaveBeenCalledTimes(1);
    }, 40000);
});
//# sourceMappingURL=userController.test.js.map