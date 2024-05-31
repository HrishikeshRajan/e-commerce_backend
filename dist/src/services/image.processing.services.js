"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImageProcessingServices = void 0;
class ImageProcessingServices {
    async uploadMultipleImages(respository, payload, options) {
        return await respository.uploadMultipleImages(payload, options);
    }
    async uploadImage(repository, payload, options) {
        return await repository.uploadImage(payload, options);
    }
}
exports.ImageProcessingServices = ImageProcessingServices;
//# sourceMappingURL=image.processing.services.js.map