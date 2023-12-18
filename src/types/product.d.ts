import type mongoose, { Types, type Document } from 'mongoose'
import { type IUser } from './IUser.interfaces'

enum currencyCode { currencyCode = 'INR' };

interface Photo {
  url: string
  secure_url: string
}
interface Image {
  url: string
  secure_url: string
}

export interface ProductCore {
  _id:Types.ObjectId
  name: string
  price: number
  currencyCode: currencyCode
  description: string
  image: Photo
  images: Types.DocumentArray<Image>
  category: string
  brand: string
  ratings: number
  numberOfReviews: number
  sellerId: Types.ObjectId
  reviews: Types.DocumentArray<Review>
  sizes: Types.Array<string>
  color: string
  gender: string
  isDiscontinued: boolean
  keywords: Types.Array<string>
  updatedAt: Date
  createdAt: Date
}

export type ProductDocument = ProductCore & Document

export interface Product extends Document {
  name: string
  price: number
  currencyCode: currencyCode
  description: string
  image: Photo
  images: Photo[]
  category: string
  brand: string
  ratings: number
  numberOfReviews: number
  sellerId: IUser['_id']
  reviews: IReview[]
  sizes: string[]
  color: string
  gender: string
  isDiscontinued: boolean
  keywords: string[]
  updated: Date
  created: Date
}

export interface UploadedFile {
  fieldname: string
  originalname: string
  encoding: string
  mimetype: string
  buffer: Buffer
  size: number
}
export interface Review {
  _id:Types.ObjectId
  title: string
  description: string
  star: number
  userId: Types.ObjectId
  date: Date
}
export interface IReview {
  title: string
  description: string
  star: number
  userId: Types.ObjectId
  date: Date
}

export interface ITEM {
  productId: Product['_id']
  qty: number
  subTotal: number
  price: number
};

export interface CART_ITEM {
  productId: Product['_id']
  qty: number
  price: number
  total: number

};
