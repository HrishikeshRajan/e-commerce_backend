"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertToMongooseId = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const convertToMongooseId = (id) => {
    return new mongoose_1.default.Types.ObjectId(id);
};
exports.convertToMongooseId = convertToMongooseId;
//# sourceMappingURL=mongodb.utils.js.map