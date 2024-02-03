/**
 * Cart Entity
 *
 */
// Model give access to instance method
import mongoose, { type Document } from 'mongoose'
import { type IUser } from '../types/IUser.interfaces'
import { type CART_ITEM } from '../types/product.interface'

// Extends Document will entends nodejs event emmitter and model properties also

export interface CART {
  products: CART_ITEM [] | null
  totalQty: number
  subTotal: number
  userId: IUser['_id']
}
export interface ICART extends Document {
  products: CART_ITEM []
  totalQty: number
  subTotal: number
  userId: IUser['_id']
  currencyCode: string
  cartStatus: string
}

const cartSchema = new mongoose.Schema<ICART>({
  products: [{
    productId: { type: mongoose.Types.ObjectId, ref: 'Product' },
    qty: Number,
    price: Number,
    total: Number
  }],
  userId: { type: mongoose.Types.ObjectId, ref: 'User' },
  totalQty: Number,
  subTotal: Number,
  currencyCode: {
    type: String,
    default: 'INR'
  },
  cartStatus: {
    type: String,
    enum: ['Active', 'Completed', 'Expired'],
    default: 'Active'
  }
}, { timestamps: true })

/**
 * @description - Automatically calculates the total price based on the cart value
 */
// cartSchema.pre('save', function (next) {
//   const cart = this as ICART
//   if (!this.isModified('products')) { next(); return }
//   const total_price_sum = cart.products.reduce((accum, product) => accum + product.sub_total, 0)
//   cart.total_price = total_price_sum
//   cart.total_qty = cart.products.reduce((accum, product) => accum + product.qty, 0)
//   next()
// })

export default mongoose.model<ICART>('C', cartSchema)
