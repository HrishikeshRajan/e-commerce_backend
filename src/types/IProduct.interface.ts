import { type IReview, type ITEM, type Product } from './product'
import { Query,  ParamsDictionary } from 'express-serve-static-core';
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

export interface GenericRequestWithQuery<P extends ParamsDictionary,Q extends Query,B,L> extends Express.Request {
  params: P
  body: B
  query:Q
  user?: L
  cookies:{
    token:string
  }
}

export interface ProductQuery {
  name?: string;
  category?: string;
  size?:string
  ratings?:string
  brand?:string
  color?:string
  isDiscontinued?:string
  description?:string
  price?:string
  sort?: string;
  limit?: string;
  page?: string;
}