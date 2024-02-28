import request from 'supertest'
import app, { createDatabaseConnection } from '../../index'

import cartModel from '../../models/cartModel'
import { StatusCodes } from 'http-status-codes'
import productModel from '../../models/productModel'

// beforeAll(async () => {
//   void createDatabaseConnection(process.env.MONGODB_URL_TEST as string)
// })

describe.skip('Cart API Tests', () => {
  describe('Add to Cart API', () => {
    afterEach(async () => {
      await cartModel.deleteMany({})
    })
    it('should return an success response when creating a new cart', async () => {
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
    it('Should return an success response with incremented qty of the item when try to add a product that already exist in cart ', async () => {
      const product = await productModel.findOne({ name: 'Product_0' })
      if (product === null) return

      const qty = 5
      let totalQty = 0
      for (let i = 0; i < qty; i++) {
        const res = await request(app).post('/api/v1/users/cart/').send({
          productId: product._id,
          qty: 1,
          userId: '646f18ade59581241e5c6b9d',
          price: 2000
        }).set('Accept', 'application/json')

        expect(res.statusCode).toBe(StatusCodes.OK)
        totalQty = res.body.message.cart.totalQty
      }

      expect(totalQty).toBe(qty)
    })
    it('Should return an error response when user submits empty request ', async () => {
      const product = await productModel.findOne({ name: 'Product_0' })
      if (product === null) return
      const qty = ''
      const res = await request(app).post('/api/v1/users/cart/').send({
        productId: '',
        qty,
        userId: '',
        price: ''
      }).set('Accept', 'application/json')

      expect(res.statusCode).toBe(StatusCodes.UNPROCESSABLE_ENTITY)
      expect(res.body.message.cart).toBeUndefined()
    })
  })
  describe.skip('Change Qty In Cart API', () => {
    afterEach(async () => {
      await cartModel.deleteMany({})
    })
    it('Should return an success response with incremented qty of the item when user selects the quantity from the list ', async () => {
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
      const selectQty = 5

      const res2 = await request(app).put('/api/v1/users/cart').send({
        productId: product._id,
        qty: selectQty,
        userId: '646f18ade59581241e5c6b9d'
      }).set('Accept', 'application/json')

      expect(res2.statusCode).toBe(StatusCodes.OK)
      expect(res2.body.message.cart.subTotal).toBe(product.price * selectQty)
    })
    it('Should return an success response with decremented qty of the item when user selects the quantity from the list ', async () => {
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
      const selectQty = 5

      const res2 = await request(app).put('/api/v1/users/cart').send({
        productId: product._id,
        qty: selectQty,
        userId: '646f18ade59581241e5c6b9d'
      }).set('Accept', 'application/json')

      expect(res2.statusCode).toBe(StatusCodes.OK)
      expect(res2.body.message.cart.subTotal).toBe(product.price * selectQty)

      const reduceQty = 2
      const res3 = await request(app).put('/api/v1/users/cart').send({
        productId: product._id,
        qty: reduceQty,
        userId: '646f18ade59581241e5c6b9d'
      }).set('Accept', 'application/json')

      expect(res3.statusCode).toBe(StatusCodes.OK)
      expect(res3.body.message.cart.subTotal).toBe(product.price * reduceQty)
    })
    it('Should return an success response and deleted the cart item when user submits with qty = 0 ', async () => {
      const product = await productModel.findOne({ name: 'Product_0' })
      const product1 = await productModel.findOne({ name: 'Product_1' })
      const product2 = await productModel.findOne({ name: 'Product_2' })
      const product3 = await productModel.findOne({ name: 'Product_3' })
      const product4 = await productModel.findOne({ name: 'Product_4' })
      if (product === null) return
      if (product1 === null) return
      if (product2 === null) return
      if (product3 === null) return
      if (product4 === null) return
      const arr = [product, product1, product2, product3, product4]
      for (let i = 0; i < arr.length; i++) {
        const qty = 1
        const res = await request(app).post('/api/v1/users/cart/').send({
          productId: arr[i]._id,
          qty,
          userId: '646f18ade59581241e5c6b9d',
          price: product.price
        }).set('Accept', 'application/json')
        expect(res.statusCode).toBe(StatusCodes.OK)
      }

      const qtyZero = 0
      const res2 = await request(app).put('/api/v1/users/cart/').send({
        productId: product._id,
        qty: qtyZero,
        userId: '646f18ade59581241e5c6b9d',
        price: product.price
      }).set('Accept', 'application/json')

      expect(res2.statusCode).toBe(StatusCodes.OK)
      expect(res2.body.message).toBeDefined()
    })
    it('Should return an error response when user submits with negative values qty = -1 ', async () => {
      const product = await productModel.findOne({ name: 'Product_0' })
      if (product === null) return
      const qty = -1
      const res = await request(app).put('/api/v1/users/cart/').send({
        productId: product._id,
        qty,
        userId: '646f18ade59581241e5c6b9d',
        price: product.price
      }).set('Accept', 'application/json')

      expect(res.statusCode).toBe(StatusCodes.UNPROCESSABLE_ENTITY)
      expect(res.body.message.cart).toBeUndefined()
    })
  })
  describe.skip('Delete Cart API', () => {
    afterEach(async () => {
      await cartModel.deleteMany({})
    })
    it('Should return an success response and delete the user cart on delete cart request ', async () => {
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

      const res2 = await request(app).delete('/api/v1/users/cart/646f18ade59581241e5c6b9d').send({

      }).set('Accept', 'application/json')

      expect(res2.statusCode).toBe(StatusCodes.OK)
      expect(res2.body.message).toBeDefined()
    })
    it('Should return an error response and delete the user cart on delete cart request with invalid', async () => {
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

      const res2 = await request(app).delete('/api/v1/users/cart/a').send({

      }).set('Accept', 'application/json')

      expect(res2.statusCode).toBe(StatusCodes.UNPROCESSABLE_ENTITY)
      expect(res2.body.message.cart).toBeUndefined()
    })
  })
})
