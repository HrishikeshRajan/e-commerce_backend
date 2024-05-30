import { type IImageProcessing } from '../types/IImage.interfaces';
import { type UploadApiOptions, type UploadApiResponse } from 'cloudinary';
export declare class ImageProcessingServices {
    uploadMultipleImages(respository: IImageProcessing, payload: string[], options: UploadApiOptions): Promise<UploadApiResponse[]>;
    uploadImage(repository: IImageProcessing, payload: string, options: UploadApiOptions): Promise<UploadApiResponse>;
}
//# sourceMappingURL=image.processing.services.d.ts.map