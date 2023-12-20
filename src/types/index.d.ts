import { type Response as ExpressResponse } from 'express'
import 'express-session'
import { type mongooseID } from '../repository/CartRepository'
import 'express-serve-static-core'
import { ShopCore } from '@models/shopModel'

export { }

export interface CART {
  productId: mongooseID
  qty: number
  subTotal?: number
  userId: mongooseID

}
declare module 'express-session'{
  interface SessionData {
    cart: CART
  }
}

declare module 'express-serve-static-core'{
 export interface Request {
    user: any
    cookies: any
    session: any
    shop:any
    query:any
  }
}



export interface ApiResponse<T> extends ExpressResponse {
  json: (data: T) => this
}
