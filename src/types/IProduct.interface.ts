import { type IReview, type ITEM, type Product } from './product'

export interface IProduct {
  createProduct: (product: Product) => Promise<any>
  deleteProduct: (productId: string) => Promise<string | undefined>
  editProduct: (productData: Product) => Promise<string | undefined>
  findProductById: (productId: string) => Promise<Product | null>
  addReview: (data: IReview, productId: string, userId: string) => Promise<void>
  deleteReview: (productId: string, userId: string) => Promise<void>
  editReview: (data: IReview, productId: string, userId: string) => Promise<void>
  reduceStock: (products: ITEM[]) => Promise<void>
}
