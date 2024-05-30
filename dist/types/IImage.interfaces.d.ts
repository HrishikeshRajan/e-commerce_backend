import { type UploadApiOptions, type UploadApiResponse } from 'cloudinary';
export interface IImageProcessing {
    uploadImage: (payload: string, options: UploadApiOptions) => Promise<UploadApiResponse>;
    uploadMultipleImages: (payload: string[], options: UploadApiOptions) => Promise<UploadApiResponse[]>;
}
//# sourceMappingURL=IImage.interfaces.d.ts.map