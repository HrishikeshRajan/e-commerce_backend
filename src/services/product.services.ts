import { type IProduct } from '../types/IProduct.interface'
import { type IReview, type ITEM, type Product } from '../types/product.interface'

class ProductServices {
  async creatProduct (respository: IProduct, product: Product): Promise<any> {
    return await respository.createProduct(product)
  }

  async editProduct (respository: IProduct, product: Product): Promise<string | undefined> {
    return await respository.editProduct(product)
  }

  async deleteProduct (respository: IProduct, productId: string): Promise<string | undefined> {
    return await respository.deleteProduct(productId)
  }

  async findProductById (respository: IProduct, productId: string): Promise<Product | null> {
    return await respository.findProductById(productId)
  }

  async addReview (respository: IProduct, data: IReview, productId: string, userId: string): Promise<void> {
    await respository.addReview(data, productId, userId)
  }

  async deleteReview (respository: IProduct, productId: string, userId: string): Promise<void> {
    await respository.deleteReview(productId, userId)
  }

  async editReview (respository: IProduct, data: IReview, productId: string, userId: string): Promise<void> {
    await respository.editReview(data, productId, userId)
  }

  async reduceStock (respository: IProduct, products: ITEM[]): Promise<void> {
    await respository.reduceStock(products)
  }
}

export default ProductServices
