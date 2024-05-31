"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertToBase64Array = exports.multerUploadArray = exports.multerUpload = exports.convertToBase64 = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const parser_1 = __importDefault(require("datauri/parser"));
const storage = multer_1.default.memoryStorage();
/**
 * @description
 * The single or array method takes the name of the form field
 */
const multerUpload = (0, multer_1.default)({ storage }).single('image');
exports.multerUpload = multerUpload;
const multerUploadArray = (0, multer_1.default)({ storage }).array('images', 12);
exports.multerUploadArray = multerUploadArray;
const dUri = new parser_1.default();
const convertToBase64 = (req) => {
    return dUri.format(path_1.default.extname(req.file?.originalname).toString(), req.file?.buffer).content;
};
exports.convertToBase64 = convertToBase64;
const convertToBase64Array = (item) => {
    const Base64Array = [];
    item.forEach((item) => {
        return Base64Array.push(dUri.format(path_1.default.extname(item.originalname).toString(), item.buffer).content);
    });
    return Base64Array;
};
exports.convertToBase64Array = convertToBase64Array;
//# sourceMappingURL=image.helper.js.map