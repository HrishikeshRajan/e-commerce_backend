"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductRepo = void 0;
const lodash_1 = require("lodash");
/**
 * Author : Hrishikesh Rajan
 *
 * Lower Level class that depend on IProduct
 */
class ProductRepo {
    ProductModel;
    constructor(model) {
        this.ProductModel = model;
    }
    /**creates new document
     * @param {ProductCore} product
     * @returns plain object
     */
    async create(product) {
        const result = await this.ProductModel.create(product);
        return result;
    }
    /**
     * finds new document that satifies both ids
     * @param {string} productId
     * @param {string} userId
     * @returns plain object
     */
    async getProductById(productId, userId) {
        const result = await this.ProductModel.findOne({ _id: productId, sellerId: userId });
        return result;
    }
    /**
     * find core product
     * @param {string} productId
     * @returns plain object
     */
    async findProductById(productId) {
        const result = await this.ProductModel.findById(productId);
        return result;
    }
    /**
     * finds product document by id
     * @param {string} productId
     * @returns plain object
     */
    async getSingleProduct(productId) {
        const result = await this.ProductModel.findById(productId).populate({
            path: 'shopId',
            select: '_id name logo description address owner email'
        });
        return result;
    }
    /**
      * merges and update the document
      * @param {ProductDocument} product
      * @param {ProductCore} body
      * @returns plain object
      */
    async updateProduct(product, body) {
        (0, lodash_1.merge)(product, body);
        product.modifiedPaths();
        const result = await product.save();
        return result;
    }
    /**
       * finds new document that satifies both ids and deletes it
       * @param {string} productId
       * @param {string} userId
       * @returns
       */
    async deleteProductById(productId, userId) {
        const result = await this.ProductModel.findOneAndDelete({ _id: productId, sellerId: userId }).select('name _id').lean();
        return result;
    }
    /**
      * Query method that returns mongoose query object based on seller id
      * @param {string} userId
      * @returns plain object
      */
    queryProductsBySellerId(userId) {
        const result = this.ProductModel.find({ sellerId: userId });
        return result;
    }
    /**
     * Query method that returns mongoose query object based on id
     * @param {string} userId
     * @returns plain object
     */
    queryProductsByShopId(shopId, userId) {
        const result = this.ProductModel.find({ sellerId: userId, _id: shopId });
        return result;
    }
    /**
      * Counts the total number of documents
      * @param {string} userId
      * @returns {number} promise
      */
    async countTotalProductsBySellerId(userId) {
        const result = await this.ProductModel.countDocuments({ sellerId: userId });
        return result;
    }
    /**
     * Counts the total number of documents
     * @param {string} userId
     * @returns {number} promise
     */
    async countTotalProductsByShopId(userId, shopId) {
        const result = await this.ProductModel.countDocuments({ sellerId: userId, shopId: shopId });
        return result;
    }
    /**
     * Counts the total number of documents based on category
     * @returns {number} promise
     */
    async countTotalProductsByCategory(category) {
        const result = await this.ProductModel.countDocuments({ category });
        return result;
    }
    /**
     * Counts the total number of documents based on category
     * @returns {number} promise
     */
    async countTotalProductsByQuery(query) {
        const result = await this.ProductModel.countDocuments(query);
        return result;
    }
    /**
      * Deletes product documents from array of id's
      * @param {string[]} productsIds
      * @returns {number} promise
      */
    async deleteProductsByIds(productsIds) {
        const result = await this.ProductModel.deleteMany({ _id: { $in: productsIds } });
        return result;
    }
    /**
      * fetches all the unique category
      * @returns  promise
      */
    async getCategory() {
        const result = await this.ProductModel.distinct('category');
        return result;
    }
    /**
      * fetches all the unique Brands names
      * @returns {number} promise
      */
    async getBrandNames(query) {
        const result = await this.ProductModel.distinct('brand', query || {});
        return result;
    }
    /**
      * fetches all the unique colors
      * @returns promise
      */
    async getColors(query) {
        const result = await this.ProductModel.distinct('color', query || {});
        return result;
    }
    /**
      * Calculates color counts
      * @returns promise
      */
    async getColorCount(category) {
        const result = this.ProductModel.aggregate([
            {
                $match: { "category": category, }
            },
            {
                $group: {
                    '_id': {
                        'color': '$color',
                    },
                    'count': {
                        '$sum': 1
                    }
                }
            },
            {
                $sort: {
                    '_id.color': 1
                }
            }
        ]);
        return result;
    }
    /**
    * Calculates brand counts
    * @returns promise
    */
    async getBrandCount(category) {
        const result = this.ProductModel.aggregate([
            {
                $match: { "category": category, }
            },
            {
                $group: {
                    '_id': {
                        'brand': '$brand',
                    },
                    'count': {
                        '$sum': 1
                    }
                }
            },
            {
                $sort: {
                    '_id.brand': 1
                }
            }
        ]);
        return result;
    }
    async getUniqueProductNames() {
        let result = await this.ProductModel.aggregate([
            {
                $group: {
                    _id: "$name",
                    count: { $sum: 1 }
                }
            },
            {
                $project: {
                    _id: 0,
                    name: "$_id",
                    count: 1
                }
            }
        ]);
        return result;
    }
}
exports.ProductRepo = ProductRepo;
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
//# sourceMappingURL=product.repository.js.map