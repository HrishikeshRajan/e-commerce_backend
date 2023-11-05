import { type IUser } from './IUser.interfaces'
import { type CART_ITEM } from './product'

export interface CART_MODEL {
  products: CART_ITEM[]
  totalQty: number
  subTotal: number
  currencyCode?: string
  userId: IUser['_id']
  cartStatus?: string
}
