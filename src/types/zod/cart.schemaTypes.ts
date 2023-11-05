import { z } from 'zod'
import mongoose from 'mongoose'

export const ADD_TO_CART_SCHEMA = z.object({
  productId: z.string().refine((id) => {
    if (mongoose.isValidObjectId(id)) {
      return true
    } else {
      return false
    }
  }, { message: 'Invalid product id' }),
  userId: z.string().refine((id) => {
    if (mongoose.isValidObjectId(id)) {
      return true
    } else {
      return false
    }
  }, { message: 'Invalid user id' }),
  qty: z.number().min(1),
  price: z.number().min(1)

})

export const CART_QTY_SCHEMA = z.object({

  qty: z.number().min(0),
  userId: z.string().refine((id) => {
    if (mongoose.isValidObjectId(id)) {
      return true
    } else {
      return false
    }
  }),
  productId: z.string().refine((id) => {
    if (mongoose.isValidObjectId(id)) {
      return true
    } else {
      return false
    }
  })

})

export const PARAMS_WITH_ID_SCHEMA = z.object({
  id: z.string().refine((id) => {
    if (mongoose.isValidObjectId(id)) {
      return true
    } else {
      return false
    }
  })
})

export type CART_QTY = z.infer<typeof CART_QTY_SCHEMA>

export type CART_INPUT = z.infer<typeof ADD_TO_CART_SCHEMA >

export type PARAMS_WITH_ID = z.infer<typeof PARAMS_WITH_ID_SCHEMA >
