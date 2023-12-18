import { type UploadApiOptions, type UploadApiResponse } from 'cloudinary'
import { type Photo } from './product'

export interface IImageProcessing {
  uploadImage: (payload: string, options: UploadApiOptions) => Promise<UploadApiResponse>
  uploadMultipleImages: (payload: string[], options: UploadApiOptions) => Promise<UploadApiResponse[]>
  // updatePhotosUrl: (item: UploadApiResponse[], productId: string) => Promise<void>
  // deletePhotosUrl: (productId: string) => Promise<void>
  // updatePhotoUrl: (item: Photo, productId: string) => Promise<void>
  // deletePhotoUrl: (productId: string) => Promise<void>
}
