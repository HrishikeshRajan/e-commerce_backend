import { type IProduct } from '../types/IProduct.interface'
import { ProductCore, ProductDocument, type IReview, type ITEM, type Product } from '../types/product.interface'

/**
 * Author : Hrishikesh Rajan
 * 
 * Higher Level class that depend on IProduct
 */
  class ProductServices {
    // Create a new product
    async createProduct<T>(repository: IProduct, product: T) {
      return await repository.create(product);
    }
  
    // Get product by ID
    async getProductById<T extends string>(repository: IProduct, productId: T, userId: T) {
      return await repository.getProductById(productId, userId);
    }
  
    // Find product by ID
    async findProductById(repository: IProduct, productId: string)  {
      return await repository.findProductById(productId);
    }
  
    // Get single product
    async getSingleProduct<T>(repository: IProduct, productId: T) {
      return await repository.getSingleProduct(productId);
    }
  
    // Update product
    async updateProduct<T extends ProductDocument, P extends ProductCore>(repository: IProduct, product: T, body: P) {
      return await repository.updateProduct(product, body);
    }
  
    // Delete product by ID
    async deleteProductById<T extends string>(repository: IProduct, productId: T, userId: T) {
      return await repository.deleteProductById(productId, userId);
    }
  
    // Query products by seller ID
    async queryProductsBySellerId<T extends string>(repository: IProduct, userId: T) {
      return await repository.queryProductsBySellerId(userId);
    }
  
    // Query products by shop ID
    async queryProductsByShopId<T, D extends string>(repository: IProduct, shopId: D, userId: T) {
      return await repository.queryProductsByShopId(shopId, userId);
    }
  
    // Count total products by seller ID
    async countTotalProductsBySellerId<T extends string>(repository: IProduct, userId: T) {
      return await repository.countTotalProductsBySellerId(userId);
    }
  
    // Count total products by shop ID
    async countTotalProductsByShopId<T, D extends string>(repository: IProduct, userId: T, shopId: D) {
      return await repository.countTotalProductsByShopId(userId, shopId);
    }
  
    // Count total products by category
    async countTotalProductsByCategory<T>(repository: IProduct, category: T){
      return await repository.countTotalProductsByCategory(category);
    }
  
    // Count total products by query
    async countTotalProductsByQuery(repository: IProduct, query: any) {
      return await repository.countTotalProductsByQuery(query);
    }
  
    // Delete products by IDs
    async deleteProductsByIds<I>(repository: IProduct, productsIds: I[]) {
      return await repository.deleteProductsByIds(productsIds);
    }
  
    // Get product category
    async getCategory(repository: IProduct) {
      return await repository.getCategory();
    }
  
    // Get product brand names
    async getBrandNames(repository: IProduct) {
      return await repository.getBrandNames();
    }
  
    // Get product colors
    async getColors(repository: IProduct) {
      return await repository.getColors();
    }
  
    // Get color count
    async getColorCount(repository: IProduct, category: string) {
      return await repository.getColorCount(category);
    }
  
    // Get brand count
    async getBrandCount(repository: IProduct, category: string) {
      return await repository.getBrandCount(category);
    }
  
  
 // Get unque names with frequency
    async getUniqueProductNames(repository: IProduct) {
      return await repository.getUniqueProductNames();
    }
  
}

export default ProductServices
