"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.getAllUsers = void 0;
const CustomError_1 = __importDefault(require("../utils/CustomError"));
const user_repository_1 = __importDefault(require("../repository/user.repository"));
const user_services_1 = __importDefault(require("../services/user.services"));
const response_services_1 = require("../services/response.services");
const http_status_codes_1 = require("http-status-codes");
const userRespository = new user_repository_1.default();
const userService = new user_services_1.default();
const getAllUsers = async (req, res, next) => {
    try {
        const users = await userService.findAllUsers(userRespository);
        const response = {
            message: { users },
            success: true,
            statusCode: http_status_codes_1.StatusCodes.OK,
            res
        };
        (0, response_services_1.sendHTTPResponse)(response);
    }
    catch (error) {
        console.log(error);
        const errorObj = error;
        next(new CustomError_1.default(errorObj.message, errorObj.code, false));
    }
};
exports.getAllUsers = getAllUsers;
const deleteUser = async (req, res, next) => {
    try {
        const user = await userService.findUserAndDelete(userRespository, { _id: req.params.id });
        const response = {
            message: { user },
            success: true,
            statusCode: http_status_codes_1.StatusCodes.OK,
            res
        };
        (0, response_services_1.sendHTTPResponse)(response);
    }
    catch (error) {
        console.log(error);
        const errorObj = error;
        next(new CustomError_1.default(errorObj.message, errorObj.code, false));
    }
};
exports.deleteUser = deleteUser;
//# sourceMappingURL=adminController.js.map