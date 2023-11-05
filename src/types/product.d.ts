import type mongoose, { Document } from 'mongoose'
import { type IUser } from './IUser.interfaces'

enum currencyCode { currencyCode = 'INR' };

interface Photo {
  url: string
  secure_url: string
}

export interface Product extends Document {
  name: string
  price: number
  currencyCode: currencyCode
  description: string
  photo: Photo
  photos: Photo[]
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
}

export interface UploadedFile {
  fieldname: string
  originalname: string
  encoding: string
  mimetype: string
  buffer: Buffer
  size: number
}

export interface IReview {
  title: string
  description: string
  star: number
  userId: mongoose.Types.ObjectId
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
