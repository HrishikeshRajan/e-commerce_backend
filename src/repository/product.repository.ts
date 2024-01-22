/* eslint-disable @typescript-eslint/no-unused-vars */
import { type Model, type Query  } from 'mongoose'
import { ProductDocument, type ProductCore, DeleteResult } from '../types/product.interface'
import { merge } from 'lodash'


export class ProductRepo<T extends ProductDocument> {
  private readonly ProductModel: Model<T>

  constructor(model: Model<T>) {
    this.ProductModel = model
  }

  /**creates new document
   * @param {ProductCore} product
   * @returns plain object
   */
  async create<T>(product: T): Promise<ProductDocument> {
    const result = await this.ProductModel.create<T>(product);
    return result
  }

  /**
   * finds new document that satifies both ids
   * @param {string} productId 
   * @param {string} userId
   * @returns plain object
   */
  async getProductById<T extends String>(productId: T, userId: T): Promise<ProductDocument | null> {
    const result = await this.ProductModel.findOne({ _id: productId, sellerId: userId });
    return result
  }

  /**
    * merges and update the document
    * @param {ProductDocument} product
    * @param {ProductCore} body
    * @returns plain object
    */
  async updateProduct<T extends ProductDocument, P extends ProductCore>(product: T, body: P): Promise<ProductDocument> {
    merge(product, body)
    product.modifiedPaths()
    const result = await product.save()
    return result
  }


  /**
     * finds new document that satifies both ids and deletes it
     * @param {string} productId 
     * @param {string} userId
     * @returns 
     */
  async deleteProductById<T extends String>(productId: T, userId: T): Promise<any | null> {
    const result = await this.ProductModel.findOneAndDelete({ _id: productId, sellerId: userId }).select('name _id').lean();
    return result
  }

  /**
    * Query method that returns mongoose query object based on seller id
    * @param {string} userId
    * @returns plain object
    */
  queryProductsBySellerId<T extends String>(userId: T): Query<ProductDocument[] | null, ProductDocument, {}, ProductDocument> {
    const result = this.ProductModel.find({ sellerId: userId });
    return result
  }

  /**
   * Query method that returns mongoose query object based on id
   * @param {string} userId
   * @returns plain object
   */
  queryProductsByShopId<T, D extends String>(shopId: D, userId: T): Query<ProductDocument[] | null, ProductDocument, {}, ProductDocument> {
    const result = this.ProductModel.find({ sellerId: userId, _id: shopId });
    return result
  }

  /**
    * Counts the total number of documents
    * @param {string} userId
    * @returns {number} promise
    */
  async countTotalProductsBySellerId<T extends String>(userId: T): Promise<number> {
    const result = await this.ProductModel.countDocuments({ sellerId: userId })
    return result
  }

  /**
   * Counts the total number of documents
   * @param {string} userId
   * @returns {number} promise
   */
  async countTotalProductsByShopId<T, D extends String>(userId: T, shopId: D): Promise<number> {
    const result = await this.ProductModel.countDocuments({ sellerId: userId, shopId: shopId })
    return result
  }

  /**
   * Counts the total number of documents based on category
   * @returns {number} promise
   */
    async countTotalProductsByCategory<T>(category: T): Promise<number> {
      const result = await this.ProductModel.countDocuments({ category })
      return result
    }
  
  /**
   * Counts the total number of documents based on category
   * @returns {number} promise
   */
      async countTotalProductsByQuery(query: any): Promise<number> {
        const result = await this.ProductModel.countDocuments(query)
        return result
      }
    

  /**
    * Deletes product documents from array of id's
    * @param {string[]} productsIds
    * @returns {number} promise
    */
  async deleteProductsByIds<I>(productsIds: I[]): Promise<DeleteResult> {
    const result = await this.ProductModel.deleteMany({ _id: { $in: productsIds } })
    return result
  }


  /**
    * fetches all the unique category 
    * @returns  promise
    */
    async getCategory(): Promise<any> {
      const result = await this.ProductModel.distinct('category' )
      return result
    }


  /**
    * fetches all the unique Brands names 
    * @returns {number} promise
    */
  async getBrandNames(): Promise<any> {
    const result = await this.ProductModel.distinct('brand' )
    return result
  }


  /**
    * fetches all the unique colors 
    * @returns promise
    */
  async getColors(): Promise<any> {
    const result = await this.ProductModel.distinct('color' )
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
