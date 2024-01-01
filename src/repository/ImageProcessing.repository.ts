import cloudinary, { type UploadApiOptions, type UploadApiResponse } from 'cloudinary'
import type CustomError from '../utils/CustomError'
import { type modifiedImageUrl } from '../types/cloudinary.interfaces'

import { type IImageProcessing } from '../types/IImage.interfaces'
import { type Photo } from '../types/product.interface'
import ProductModel from '../models/productModel'

class Cloudinary implements IImageProcessing {
  async uploadImage (payload: string, options: UploadApiOptions): Promise<UploadApiResponse> {
    try {
      const result = await cloudinary.v2.uploader.upload(payload, options)
      return result
    } catch (error: unknown) {
      console.log(error)
      const errorObj = error as CustomError
      throw new Error(errorObj.message)
    }
  }

  async uploadMultipleImages (payload: string[], options: UploadApiOptions): Promise<UploadApiResponse[]> {
    const result: UploadApiResponse[] = []
    try {
      for (let i = 0; i < payload.length; i++) {
        result.push(await cloudinary.v2.uploader.upload(payload[i], options))
      }
      return result
    } catch (error: unknown) {
      console.log(error)
      const errorObj = error as CustomError
      throw new Error(errorObj.message)
    }
  }

  // /**
  //  * @deprecated
  //  */
  // async updatePhotosUrl (item: UploadApiResponse[], productId: string): Promise<void> {
  //   try {
  //     const newUrls: modifiedImageUrl[] = []
  //     item.forEach((item: UploadApiResponse) => { newUrls.push({ url: item.url, secure_url: item.secure_url }) })
  //     const productRepository = new ProductsRepository(ProductModel)
  //     const product = await new ProductServices().findProductById(productRepository, productId)

  //     newUrls.forEach((item) => {
  //       product?.images.push(item)
  //     })
  //     await product?.save()
  //   } catch (error: unknown) {
  //     console.log(error)
  //     const errorObj = error as CustomError
  //     throw new Error(errorObj.message)
  //   }
  // }
  // /**
  //  * @deprecated
  //  */
  // async deletePhotosUrl (productId: string): Promise<void> {
  //   try {
  //     const productRepository = new ProductsRepository(ProductModel)
  //     const product = await new ProductServices().findProductById(productRepository, productId)
  //     if (!product) throw new Error('Product not found')
  //     product.images = []
  //     await product.save()
  //   } catch (error: unknown) {
  //     console.log(error)
  //     const errorObj = error as CustomError
  //     throw new Error(errorObj.message)
  //   }
  // }
  // /**
  //  * @deprecated
  //  */
  // async updatePhotoUrl (item: Photo, productId: string): Promise<void> {
  //   try {
  //     const productRepository = new ProductsRepository(ProductModel)
  //     const product = await new ProductServices().findProductById(productRepository, productId)

  //     if (!product) return
  //     product.image.url = item.url
  //     product.image.secure_url = item.secure_url
  //     await product.save()
  //   } catch (error: unknown) {
  //     console.log(error)
  //     const errorObj = error as CustomError
  //     throw new Error(errorObj.message)
  //   }
  // }
  // /**
  //  * @deprecated
  //  */
  // async deletePhotoUrl (productId: string): Promise<void> {
  //   try {
  //     const productRepository = new ProductsRepository(ProductModel)
  //     const product = await new ProductServices().findProductById(productRepository, productId)
  //     if (!product) throw new Error('Product not found')
  //     product.image.url = ''
  //     product.image.secure_url = ''
  //     await product.save()
  //   } catch (error: unknown) {
  //     console.log(error)
  //     const errorObj = error as CustomError
  //     throw new Error(errorObj.message)
  //   }
  // }
}

export default Cloudinary
