"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cloudinary_1 = __importDefault(require("cloudinary"));
class Cloudinary {
    async uploadImage(payload, options) {
        try {
            const result = await cloudinary_1.default.v2.uploader.upload(payload, options);
            return result;
        }
        catch (error) {
            console.log(error);
            const errorObj = error;
            throw new Error(errorObj.message);
        }
    }
    async uploadMultipleImages(payload, options) {
        const result = [];
        try {
            for (let i = 0; i < payload.length; i++) {
                result.push(await cloudinary_1.default.v2.uploader.upload(payload[i], options));
            }
            return result;
        }
        catch (error) {
            console.log(error);
            const errorObj = error;
            throw new Error(errorObj.message);
        }
    }
}
exports.default = Cloudinary;
//# sourceMappingURL=ImageProcessing.repository.js.map