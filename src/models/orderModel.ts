import mongoose, { type Document } from 'mongoose'
import { type Address, type IUser } from '../types/IUser.interfaces'
import { type CART_ITEM } from '../types/product.interface'

export type mongoose_id = mongoose.Types.ObjectId

export enum PAYMENT_METHOD {
  CARD = 'CARD',
  COD = 'CASH ON DELIVERY',
}
export enum PAYMENT_STATUS {
  PENDING = 'PENDING ',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
}

export enum ORDER_STATUS {
  PENDING = 'PENDING',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
  CANCELED = 'CANCELED',
  ACTIVE = 'ACTIVE'
}
export enum DELIVERY_STATUS {
  PENDING = 'PENDING',
  ORDER_PROCESSING = 'PROCESSING',
  ORDER_PLACED = 'PLACED',
  SHIPPED = 'SHIPPED',
  OUT_FOR_DELIVERY = 'OUTFOR DELIVERY',
  DELIVERED = 'DELIVERED'
}

export interface ORDER {
  products: CART_ITEM []
  grandTotal: number
  totalQuantity: number
  currencyCode: string
  orderStatus: string
  shippingAddress: Address
  paymentMethod: string
  paymentStatus: string
  paymentId: string
  discountPercentage: number
  isDiscountApplied: boolean
  priceAfterDiscount: number
  savedAmount: number
  userId: IUser['_id']
}

export interface IORDER extends Document {
  products: CART_ITEM []
  grandTotal: number
  totalQuantity: number
  currencyCode: string
  orderStatus: string
  deliveryStatus: string
  shippingAddress: Address
  paymentMethod: string
  paymentStatus: string
  paymentId: string
  discountPercentage: number
  isDiscountApplied: boolean
  priceAfterDiscount: number
  savedAmount: number
  userId: IUser['_id']

}

const orderSchema = new mongoose.Schema<IORDER>({
  products: [{
    productId: { type: mongoose.Types.ObjectId, ref: 'Product' },
    qty: Number,
    price: Number,
    total: Number
  }],
  grandTotal: Number,
  currencyCode: {
    type: String,
    enum: ['INR'],
    default: 'INR'
  },
  totalQuantity: Number,
  orderStatus: {
    type: String,
    enum: [ORDER_STATUS.PENDING, ORDER_STATUS.SUCCESS, ORDER_STATUS.FAILED, ORDER_STATUS.CANCELED],
    default: ORDER_STATUS.PENDING,
    trim: true
  },
  shippingAddress: {
    fullname: {
      type: String

    },
    city: {
      type: String

    },
    homeAddress: {
      type: String

    },
    state: {
      type: String

    },
    postalCode: {
      type: Number

    },
    phoneNo: {
      type: Number

    },
    country: {
      type: String

    }
  },
  paymentMethod: {
    type: String,
    enum: [PAYMENT_METHOD.CARD, PAYMENT_METHOD.COD],
    default: null
  },
  paymentStatus: {
    type: String,
    enum: [PAYMENT_STATUS.PENDING, PAYMENT_STATUS.SUCCESS, PAYMENT_STATUS.FAILED],
    default: PAYMENT_STATUS.PENDING

  },
  paymentId: String,
  discountPercentage: Number,
  priceAfterDiscount: Number,
  isDiscountApplied: {
    type: Boolean,
    default: false
  },
  userId: {
    type: mongoose.Types.ObjectId,
    ref: 'User'
  }

}, {
  timestamps: true
})

export default mongoose.model<IORDER>('Order', orderSchema)
