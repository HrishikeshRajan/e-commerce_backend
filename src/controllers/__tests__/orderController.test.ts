import request from 'supertest'
import app, { createDatabaseConnection } from '../../index'

import { StatusCodes } from 'http-status-codes'
import productModel from '../../models/productModel'

// beforeAll(async () => {
//   void createDatabaseConnection(process.env.MONGODB_URL_TEST as string)
// })

describe.skip('Order API Tests', () => {
  describe('Checkout API', () => {
    it.skip('should return an success response with ordered products', async () => {
      const product = await productModel.findOne({ name: 'Product_0' })
      if (product === null) return
      const qty = 1
      const res = await request(app).post('/api/v1/users/cart/').send({
        productId: product._id,
        qty,
        userId: '646f18ade59581241e5c6b9d',
        price: product.price
      }).set('Accept', 'application/json')

      expect(res.statusCode).toBe(StatusCodes.OK)
      expect(res.body.message.cart.totalQty).toBe(qty)
    })
  })
})
