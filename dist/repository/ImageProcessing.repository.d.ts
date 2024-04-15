import { type UploadApiOptions, type UploadApiResponse } from 'cloudinary';
import { type IImageProcessing } from '../types/IImage.interfaces';
declare class Cloudinary implements IImageProcessing {
    uploadImage(payload: string, options: UploadApiOptions): Promise<UploadApiResponse>;
    uploadMultipleImages(payload: string[], options: UploadApiOptions): Promise<UploadApiResponse[]>;
}
export default Cloudinary;
//# sourceMappingURL=ImageProcessing.repository.d.ts.map