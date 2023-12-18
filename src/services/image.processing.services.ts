import { type IImageProcessing } from '../types/IImage.interfaces'
import { type UploadApiOptions, type UploadApiResponse } from 'cloudinary'
import { type Photo } from '../types/product'

export class ImageProcessingServices {
  async uploadMultipleImages (respository: IImageProcessing, payload: string[], options: UploadApiOptions): Promise<UploadApiResponse[]> {
    return await respository.uploadMultipleImages(payload, options)
  }

  async uploadImage (repository: IImageProcessing, payload: string, options: UploadApiOptions): Promise<UploadApiResponse> {
    return await repository.uploadImage(payload, options)
  }
  
  // async updatePhotoUrl (respository: IImageProcessing, url: Photo, productId: string) {
  //   await respository.updatePhotoUrl(url, productId)
  // }

  // async updatePhotosUrl (respository: IImageProcessing, urls: UploadApiResponse[], productId: string) {
  //   await respository.updatePhotosUrl(urls, productId)
  // }

  // async deletePhotosUrl (respository: IImageProcessing, productId: string) {
  //   await respository.deletePhotosUrl(productId)
  // }



  // async deletePhotoUrl (respository: IImageProcessing, productId: string) {
  //   await respository.deletePhotoUrl(productId)
  // }
}
