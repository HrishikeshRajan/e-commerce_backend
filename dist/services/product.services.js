"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Author : Hrishikesh Rajan
 *
 * Higher Level class that depend on IProduct
 */
class ProductServices {
    // Create a new product
    async createProduct(repository, product) {
        return await repository.create(product);
    }
    // Get product by ID
    async getProductById(repository, productId, userId) {
        return await repository.getProductById(productId, userId);
    }
    // Find product by ID
    async findProductById(repository, productId) {
        return await repository.findProductById(productId);
    }
    // Get single product
    async getSingleProduct(repository, productId) {
        return await repository.getSingleProduct(productId);
    }
    // Update product
    async updateProduct(repository, product, body) {
        return await repository.updateProduct(product, body);
    }
    // Delete product by ID
    async deleteProductById(repository, productId, userId) {
        return await repository.deleteProductById(productId, userId);
    }
    // Query products by seller ID
    async queryProductsBySellerId(repository, userId) {
        return await repository.queryProductsBySellerId(userId);
    }
    // Query products by shop ID
    async queryProductsByShopId(repository, shopId, userId) {
        return await repository.queryProductsByShopId(shopId, userId);
    }
    // Count total products by seller ID
    async countTotalProductsBySellerId(repository, userId) {
        return await repository.countTotalProductsBySellerId(userId);
    }
    // Count total products by shop ID
    async countTotalProductsByShopId(repository, userId, shopId) {
        return await repository.countTotalProductsByShopId(userId, shopId);
    }
    // Count total products by category
    async countTotalProductsByCategory(repository, category) {
        return await repository.countTotalProductsByCategory(category);
    }
    // Count total products by query
    async countTotalProductsByQuery(repository, query) {
        return await repository.countTotalProductsByQuery(query);
    }
    // Delete products by IDs
    async deleteProductsByIds(repository, productsIds) {
        return await repository.deleteProductsByIds(productsIds);
    }
    // Get product category
    async getCategory(repository) {
        return await repository.getCategory();
    }
    // Get product brand names
    async getBrandNames(repository, query) {
        return await repository.getBrandNames(query);
    }
    // Get product colors
    async getColors(repository, query) {
        return await repository.getColors(query);
    }
    // Get color count
    async getColorCount(repository, category) {
        return await repository.getColorCount(category);
    }
    // Get brand count
    async getBrandCount(repository, category) {
        return await repository.getBrandCount(category);
    }
    // Get unque names with frequency
    async getUniqueProductNames(repository) {
        return await repository.getUniqueProductNames();
    }
}
exports.default = ProductServices;
//# sourceMappingURL=product.services.js.map