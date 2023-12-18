/* eslint-disable @typescript-eslint/no-unused-vars */
import { type Model, type Document } from 'mongoose'

import { type IProduct } from '../types/IProduct.interface'
import { ProductDocument, type IReview, type ITEM, type Product, ProductCore } from '../types/product'
import type CustomError from '../utils/CustomError'
import ProductModel from '../models/productModel'

export class ProductRepo<T extends ProductDocument>{
  private readonly ProductModel: Model<T>

  constructor (model: Model<T>) {
    this.ProductModel = model
  }

  /**
   * @param {ProductCore} product
   * @returns plain object
   */
  async create<T extends ProductCore>(product: T): Promise<ProductDocument> {
    const result = await this.ProductModel.create<T>(product);
    return result
  }
}

// /**
//  * @deprecated
//  */
// class ProductsRepository implements IProduct {
//   private readonly ProductModel: Model<Product>

//   constructor (model: Model<Product>) {
//     this.ProductModel = model
//   }

//   /**
//    * @param {Product} product
//    * @returns plain object
//    */
//   async createProduct(product: Product): Promise<any> {
//     const result = await this.ProductModel.create(product);
//     return result
//   }

//   async editReview (data: IReview, productId: string, userId: string): Promise<void> {
//     const product = await ProductModel.findById(productId)
//     if (product == null) return
//     product.reviews.find((item: any) => {
//       if (userId.toString() === item.userId.toString()) {
//         item.title = (data.title.length > 0) ? data.title : item.title
//         item.description = (data.description.length > 0) ? data.description : item.description
//         item.star = (data.star !== 0) ? data.star : item.star
//         item.userId = data.userId
//       }
//     })

//     const [totalRating, count] = this.calculateRating(product)
//     product.ratings = totalRating
//     product.numberOfReviews = count

//     await product.save()
//   }

//   async deleteReview (productId: string, userId: string): Promise<void> {
//     try {
//       const product = await ProductModel.findById(productId)
//       if (product == null) throw new Error('Product not found')
//       product.reviews.filter((item: any, index: number) => {
//         if (userId.toString() === item.userId.toString()) {
//           product.reviews.splice(index, 1)
//         }
//       })
//       const [totalRating, count] = this.calculateRating(product)
//       product.ratings = totalRating
//       product.numberOfReviews = count
//       await product.save()
//     } catch (error: unknown) {
//       const errorObj = error as CustomError
//       throw new Error(errorObj.message)
//     }
//   }

//   async deleteProduct (productId: string): Promise<string | undefined> {
//     try {
//       const result = await ProductModel.findByIdAndDelete(productId)
//       return result?._id
//     } catch (error: unknown) {
//       const errorObj = error as CustomError
//       throw new Error(errorObj.message)
//     }
//   }

//   async editProduct (productData: Product): Promise<string | undefined> {
//     try {
//       const newData = {
//         name: productData.name,
//         price: productData.price,
//         currencyCode: productData.currencyCode,
//         description: productData.description,
//         image: productData.image,
//         category: productData.category,
//         brand: productData.brand,
//         sellerId: productData.sellerId,
//         sizes: productData.sizes,
//         color: productData.color,
//         gender: productData.gender,
//         isDiscontinued: productData.isDiscontinued
//       }
//       const options = { upsert: true, new: true, setDefaultsOnInsert: true }
//       const result = await ProductModel.findOneAndUpdate({ _id: productData.id }, newData, options)
//       return result?._id
//     } catch (error: unknown) {
//       const errorObj = error as CustomError
//       throw new Error(errorObj.message)
//     }
//   }

//   async findProductById (productId: string): Promise<Product | null> {
//     const result = await ProductModel.findById(productId).lean()
//     return result
//   }

//   async addReview (data: IReview, productId: string, userId: string): Promise<void> {
//     const product = await ProductModel.findById(productId)
//     if (product == null) return

//     const alreadyReviewed: any = product.reviews.find((item: any) => (userId.toString() === item.userId.toString()))
//     if (alreadyReviewed != null) {
//       product.reviews.find((item: any) => {
//         if (userId.toString() === item.userId.toString()) {
//           item.title = (data.title.length > 0) ? data.title : item.title
//           item.description = (data.description.length > 0) ? data.description : item.description
//           item.star = (data.star !== 0) ? data.star : item.star
//           item.userId = data.userId
//           return true
//         }
//         return false
//       })
//     } else {
//       product?.reviews.push(data)
//     }

//     const [totalRating, count] = this.calculateRating(product)
//     product.ratings = totalRating
//     product.numberOfReviews = count
//     await product.save()
//   }

//   calculateRating (product: Product): number[] {
//     const totalReviews = product.reviews.length
//     const sumOfRatings = product.reviews.reduce((start, end) => start + end.star, 0)
//     const rating = (sumOfRatings / totalReviews)
//     return [rating, totalReviews]
//   }

//   async reduceStock (products: ITEM[]): Promise<void> {
//     try {
//       const myProducts = products
//       for (const product of myProducts) {
//         const options = { upsert: true, new: true, setDefaultsOnInsert: true }
//       }
//     } catch (error: unknown) {
//       const errorObj = error as CustomError
//       throw new Error(errorObj.message)
//     }
//   }
// }

// export default ProductsRepository
