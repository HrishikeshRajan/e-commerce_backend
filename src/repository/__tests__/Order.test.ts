import mongoose from 'mongoose'
import request from 'supertest'
import app, { createDatabaseConnection } from '../../index'

import cartModel from '../../models/cartModel'
import orderModel from '../../models/orderModel'

beforeAll(async () => {
  createDatabaseConnection(process.env.MONGODB_URL_TEST as string)
})
afterAll(async () => {
  await mongoose.connection.close()
})

describe.skip('Order API Tests', () => {
  describe('Create Order API', () => {
    afterAll(async () => {
      await orderModel.collection.drop()
      await cartModel.collection.drop()
    })
    it('Should create new order and return 201 as status', async () => {
      const cartResponse = await request(app).post('/api/v1/user/cart/add').send({
        product_id: '64ae97a075cdbf93a340b7cb',
        qty: 15,
        user_id: '646f18ade59581241e5c6b9d'
      }).set('Accept', 'application/json')

      const orderResponse = await request(app).post('/api/v1/user/orders').send({
        cart_id: cartResponse.body.message.cart_id,
        user_id: '646f18ade59581241e5c6b9d'
      }).set('Accept', 'application/json')

      expect(orderResponse.statusCode).toBe(201)
      expect(orderResponse.body.message).toBeDefined()
      expect(orderResponse.body.message.total_cost).toBeDefined()
      expect(orderResponse.body.message.total_quantity).toBeDefined()
      expect(orderResponse.body.message.order_status).toBe('pending')
    })
    it('Should create new order and set order id in cart', async () => {
      const cartResponse = await request(app).post('/api/v1/user/cart/add').send({
        product_id: '64ae97a075cdbf93a340b7cb',
        qty: 15,
        user_id: '646f18ade59581241e5c6b9d'
      }).set('Accept', 'application/json')

      const orderResponse = await request(app).post('/api/v1/user/orders').send({
        cart_id: cartResponse.body.message.cart_id,
        user_id: '646f18ade59581241e5c6b9d'
      }).set('Accept', 'application/json')

      const res = await request(app)
        .get(`/api/v1/user/cart/${cartResponse.body.message.cart_id}`)

      expect(res.statusCode).toBe(200)
      expect(res.body.message).toBeDefined()
      expect(res.body.message.order_id).toBeDefined()
    })
    it('Should throw error on invalid input ID', async () => {
      const cartResponse = await request(app).post('/api/v1/user/cart/add').send({
        product_id: '64ae97a075cdbf93a340b7cb',
        qty: 15,
        user_id: '64ad11a948576a167d92cdfd'
      }).set('Accept', 'application/json')

      // We store cart id in local storage
      const orderResponse = await request(app).post('/api/v1/user/orders').send({
        cart_id: cartResponse.body.message.cart_id
      }).set('Accept', 'application/json')

      expect(orderResponse.statusCode).toBe(422)
      expect(orderResponse.body.message).toBeDefined()
    })
    it('Should throw error on empty input', async () => {
      const cartResponse = await request(app).post('/api/v1/user/cart/add').send({
        product_id: '64ae97a075cdbf93a340b7cb',
        qty: 15,
        user_id: '64ad11a948576a167d92cdfd'
      }).set('Accept', 'application/json')

      const orderResponse = await request(app).post('/api/v1/user/orders').send({
        cart_id: '',
        user_id: ''
      }).set('Accept', 'application/json')

      expect(orderResponse.statusCode).toBe(422)
      expect(orderResponse.body.message).toBeDefined()
    })
  })
  describe('Shipping Address API', () => {
    afterAll(async () => {
      await orderModel.collection.drop()
      await cartModel.collection.drop()
    })
    it('Should return order object with shipping address with 201 as status', async () => {
      const cartResponse = await request(app).post('/api/v1/user/cart/add').send({
        product_id: '64ae97a075cdbf93a340b7cb',
        qty: 15,
        user_id: '646f18ade59581241e5c6b9d'
      }).set('Accept', 'application/json')

      const orderResponse = await request(app).post('/api/v1/user/orders').send({
        cart_id: cartResponse.body.message.cart_id,
        user_id: '646f18ade59581241e5c6b9d'
      }).set('Accept', 'application/json')

      const addressResponse = await request(app).put('/api/v1/user/orders/address').send({
        order_id: orderResponse.body.message.order_id,
        user_id: '646f18ade59581241e5c6b9d',
        full_name: 'Test User',
        city: 'Test City',
        home_address: 'Test Address',
        state: 'Test State',
        postal_code: 685545,
        phone_no: 123456789,
        country: 'india'
      }).set('Accept', 'application/json')

      expect(addressResponse.statusCode).toBe(201)
      expect(addressResponse.body.message).toBeDefined()
      expect(addressResponse.body.message.shipping_address).toBeDefined()
      expect(addressResponse.body.message.shipping_address.full_name).toBe('Test User')
    })

    it.skip('Should throw error any failure', async () => {
      const cartResponse = await request(app).post('/api/v1/user/cart/add').send({
        product_id: '64ae97a075cdbf93a340b7cb',
        qty: 15,
        user_id: '646f18ade59581241e5c6b9d'
      }).set('Accept', 'application/json')

      const orderResponse = await request(app).post('/api/v1/user/orders').send({
        cart_id: cartResponse.body.message.cart_id,
        user_id: '646f18ade59581241e5c6b9d'
      }).set('Accept', 'application/json')

      const addressResponse = await request(app).put('/api/v1/user/orders/address').send({
        order_id: orderResponse.body.message._id,
        user_id: '646f18ade59581241e5c6b9d',
        fullname: 'Test User',
        city: 'Test City',
        home_address: 'Test Address',
        state: 'Test State',
        postal_code: 685545,
        phone_no: 123456789,
        country: 'india'
      }).set('Accept', 'application/json')

      expect(addressResponse.statusCode).toBe(500)
      expect(addressResponse.body.message).toBeDefined()
      // expect(addressResponse.body.message.shipping_address).toBeDefined();
      // expect(addressResponse.body.message.shipping_address.fullname).toBe('Test User');
    })
    it('Should throw error any when order not found', async () => {
      const addressResponse = await request(app).put('/api/v1/user/orders/address').send({
        order_id: '646f18ade59581241e5c6b9d',
        user_id: '646f18ade59581241e5c6b9d',
        full_name: 'Test User',
        city: 'Test City',
        home_address: 'Test Address',
        state: 'Test State',
        postal_code: 685545,
        phone_no: 123456789,
        country: 'india'
      }).set('Accept', 'application/json')

      expect(addressResponse.statusCode).toBe(500)
      expect(addressResponse.body.message).toBeDefined()
      // expect(addressResponse.body.message.shipping_address).toBeDefined();
      // expect(addressResponse.body.message.shipping_address.fullname).toBe('Test User');
    })
    it('Should throw error on empty input', async () => {
      const orderResponse = await request(app).put('/api/v1/user/orders/address').send({
        cart_id: '',
        user_id: '',
        fullname: '',
        city: '',
        home_address: '',
        state: '',
        postal_code: '',
        phone_no: '',
        country: ''
      }).set('Accept', 'application/json')
      expect(orderResponse.statusCode).toBe(422)
      expect(orderResponse.body.message).toBeDefined()
    })
  })
  describe('Billing Address API', () => {
    afterAll(async () => {
      await orderModel.collection.drop()
      await cartModel.collection.drop()
    })
    it('Should return order object with shipping address with 201 as status', async () => {
      const cartResponse = await request(app).post('/api/v1/user/cart/add').send({
        product_id: '64ae97a075cdbf93a340b7cb',
        qty: 15,
        user_id: '646f18ade59581241e5c6b9d'
      }).set('Accept', 'application/json')

      const orderResponse = await request(app).post('/api/v1/user/orders').send({
        cart_id: cartResponse.body.message.cart_id,
        user_id: '646f18ade59581241e5c6b9d'
      }).set('Accept', 'application/json')

      const addressResponse = await request(app).put('/api/v1/user/orders/address/billing').send({
        order_id: orderResponse.body.message.order_id,
        user_id: '646f18ade59581241e5c6b9d',
        full_name: 'Test User',
        city: 'Test City',
        home_address: 'Test Address',
        state: 'Test State',
        postal_code: 685545,
        phone_no: 123456789,
        country: 'india',
        water: 'sss'
      }).set('Accept', 'application/json')

      expect(addressResponse.statusCode).toBe(201)
      expect(addressResponse.body.message).toBeDefined()
      expect(addressResponse.body.message.billing_address).toBeDefined()
      expect(addressResponse.body.message.billing_address.full_name).toBe('Test User')
    })
    it.skip('Should throw error any failure', async () => {
      const cartResponse = await request(app).post('/api/v1/user/cart/add').send({
        product_id: '64ae97a075cdbf93a340b7cb',
        qty: 15,
        user_id: '646f18ade59581241e5c6b9d'
      }).set('Accept', 'application/json')

      const orderResponse = await request(app).post('/api/v1/user/orders').send({
        cart_id: cartResponse.body.message.cart_id,
        user_id: '646f18ade59581241e5c6b9d'
      }).set('Accept', 'application/json')

      const addressResponse = await request(app).put('/api/v1/user/orders/address/billing').send({
        order_id: orderResponse.body.message._id,
        user_id: '646f18ade59581241e5c6b9d',
        fullname: 'Test User',
        city: 'Test City',
        home_address: 'Test Address',
        state: 'Test State',
        postal_code: 685545,
        phone_no: 123456789,
        country: 'india'
      }).set('Accept', 'application/json')

      expect(addressResponse.statusCode).toBe(500)
      expect(addressResponse.body.message).toBeDefined()
    })
    it('Should throw error any when order not found', async () => {
      const addressResponse = await request(app).put('/api/v1/user/orders/address/billing').send({
        order_id: '646f18ade59581241e5c6b9d',
        user_id: '646f18ade59581241e5c6b9d',
        full_name: 'Test User',
        city: 'Test City',
        home_address: 'Test Address',
        state: 'Test State',
        postal_code: 685545,
        phone_no: 123456789,
        country: 'india'
      }).set('Accept', 'application/json')

      expect(addressResponse.statusCode).toBe(500)
      expect(addressResponse.body.message).toBeDefined()
    })
    it('Should throw error on empty input', async () => {
      await request(app).post('/api/v1/user/cart/add').send({
        product_id: '64ae97a075cdbf93a340b7cb',
        qty: 15,
        user_id: '64ad11a948576a167d92cdfd'
      }).set('Accept', 'application/json')

      const orderResponse = await request(app).put('/api/v1/user/orders/address/billing').send({
        cart_id: '',
        user_id: '',
        fullname: '',
        city: '',
        home_address: '',
        state: '',
        postal_code: '',
        phone_no: '',
        country: ''
      }).set('Accept', 'application/json')

      expect(orderResponse.statusCode).toBe(422)
      expect(orderResponse.body.message).toBeDefined()
    })
  })
  describe.skip('Payment API', () => {
    afterAll(async () => {
      await orderModel.collection.drop()
      await cartModel.collection.drop()
    })

    it('Should return order object with corresponding order id', async () => {
      const cartResponse = await request(app).post('/api/v1/user/cart/add').send({
        product_id: '64ae97a075cdbf93a340b7cb',
        qty: 15,
        user_id: '646f18ade59581241e5c6b9d'
      }).set('Accept', 'application/json')

      const orderResponse = await request(app).post('/api/v1/user/orders').send({
        cart_id: cartResponse.body.message.cart_id,
        user_id: '646f18ade59581241e5c6b9d'
      }).set('Accept', 'application/json')

      const paymentResponse = await request(app).post('/api/v1/user/orders/payment').send({
        order_id: orderResponse.body.message.order_id,
        user_id: '646f18ade59581241e5c6b9d'

      }).set('Accept', 'application/json')

      const order = paymentResponse.body.message

      expect(order.order_status).toBe('success')
      expect(order.payment_id).toBeDefined()
      expect(order.payment_client_id).toBeDefined()
    })

    it('Should throw error on invalid id', async () => {
      const paymentResponse = await request(app).post('/api/v1/user/orders/payment').send({
        order_id: '43243243232432432432424242',
        user_id: '8789789789ab7b787b9879878'

      }).set('Accept', 'application/json')

      expect(paymentResponse.statusCode).toBe(422)
    })
    it.skip('Should throw error on order not found', async () => {
      const paymentResponse = await request(app).post('/api/v1/user/orders/payment').send({
        order_id: '646f18ade59581241e5c6b9d',
        user_id: '646f18ade59581241e5c6b9d'

      }).set('Accept', 'application/json')

      expect(paymentResponse.statusCode).toBe(500)
    })
    it.skip('Should  throw error on server error', async () => {
      const cartResponse = await request(app).post('/api/v1/user/cart/add').send({
        product_id: '64ae97a075cdbf93a340b7cb',
        qty: 15,
        user_id: '646f18ade59581241e5c6b9d'
      }).set('Accept', 'application/json')

      const orderResponse = await request(app).post('/api/v1/user/orders').send({
        cart_id: cartResponse.body.message.cart_id,
        user_id: '646f18ade59581241e5c6b9d'
      }).set('Accept', 'application/json')

      const paymentResponse = await request(app).post('/api/v1/user/orders/payment').send({
        order_id: orderResponse.body.message.order_id,
        user_id: '646f18ade59581241e5c6b9d'
      }).set('Accept', 'application/json')

      expect(paymentResponse.statusCode).toBe(500)
      expect(paymentResponse.body.message.payment_status).toBe('failed')
    })
  })
  describe('Cancel Order API', () => {
    afterAll(async () => {
      await orderModel.collection.drop()
      await cartModel.collection.drop()
    })

    it('Should return order object with order status "canceled"', async () => {
      const cartResponse = await request(app).post('/api/v1/user/cart/add').send({
        product_id: '64ae97a075cdbf93a340b7cb',
        qty: 15,
        user_id: '646f18ade59581241e5c6b9d'
      }).set('Accept', 'application/json')

      const orderResponse = await request(app).post('/api/v1/user/orders').send({
        cart_id: cartResponse.body.message.cart_id,
        user_id: '646f18ade59581241e5c6b9d'
      }).set('Accept', 'application/json')

      const orderCancelResponse = await request(app).put(`/api/v1/user/orders/status/${orderResponse.body.message.order_id}`).send({
      })

      expect(orderCancelResponse.statusCode).toBe(201)
      expect(orderCancelResponse.body.message.order_status).toBe('canceled')
    })
    it('Should throw error on invalid id', async () => {
      const orderCancelResponse = await request(app).put('/api/v1/user/orders/status/dadaa').send({
      })

      expect(orderCancelResponse.statusCode).toBe(422)
    })
  })
})

describe.skip('Delivery Order API', () => {
  afterAll(async () => {
    await orderModel.collection.drop()
    await cartModel.collection.drop()
  })

  it('Should return order object with delivery status "processing"', async () => {
    const cartResponse = await request(app).post('/api/v1/user/cart/add').send({
      product_id: '64ae97a075cdbf93a340b7cb',
      qty: 15,
      user_id: '646f18ade59581241e5c6b9d'
    }).set('Accept', 'application/json')

    const orderResponse = await request(app).post('/api/v1/user/orders').send({
      cart_id: cartResponse.body.message.cart_id,
      user_id: '646f18ade59581241e5c6b9d'
    }).set('Accept', 'application/json')

    const deliveryResponse = await request(app).put('/api/v1/user/orders/delivery/status').send({
      order_id: orderResponse.body.message.order_id,
      user_id: '646f18ade59581241e5c6b9d',
      status: 'processing'
    }).set('Accept', 'application/json')

    expect(deliveryResponse.statusCode).toBe(201)
    expect(deliveryResponse.body.message.delivery_status).toBe('processing')
  })
  it('Should return order object with delivery status "accepted"', async () => {
    const cartResponse = await request(app).post('/api/v1/user/cart/add').send({
      product_id: '64ae97a075cdbf93a340b7cb',
      qty: 15,
      user_id: '646f18ade59581241e5c6b9d'
    }).set('Accept', 'application/json')

    const orderResponse = await request(app).post('/api/v1/user/orders').send({
      cart_id: cartResponse.body.message.cart_id,
      user_id: '646f18ade59581241e5c6b9d'
    }).set('Accept', 'application/json')

    const deliveryResponse = await request(app).put('/api/v1/user/orders/delivery/status').send({
      order_id: orderResponse.body.message.order_id,
      user_id: '646f18ade59581241e5c6b9d',
      status: 'accepted'
    }).set('Accept', 'application/json')

    expect(deliveryResponse.statusCode).toBe(201)
    expect(deliveryResponse.body.message.delivery_status).toBe('accepted')
  })
  it('Should return order object with delivery status "shipped"', async () => {
    const cartResponse = await request(app).post('/api/v1/user/cart/add').send({
      product_id: '64ae97a075cdbf93a340b7cb',
      qty: 15,
      user_id: '646f18ade59581241e5c6b9d'
    }).set('Accept', 'application/json')

    const orderResponse = await request(app).post('/api/v1/user/orders').send({
      cart_id: cartResponse.body.message.cart_id,
      user_id: '646f18ade59581241e5c6b9d'
    }).set('Accept', 'application/json')

    const deliveryResponse = await request(app).put('/api/v1/user/orders/delivery/status').send({
      order_id: orderResponse.body.message.order_id,
      user_id: '646f18ade59581241e5c6b9d',
      status: 'shipped'
    }).set('Accept', 'application/json')

    expect(deliveryResponse.statusCode).toBe(201)
    expect(deliveryResponse.body.message.delivery_status).toBe('shipped')
  })
  it('Should return order object with delivery status "out for delivery"', async () => {
    const cartResponse = await request(app).post('/api/v1/user/cart/add').send({
      product_id: '64ae97a075cdbf93a340b7cb',
      qty: 15,
      user_id: '646f18ade59581241e5c6b9d'
    }).set('Accept', 'application/json')

    const orderResponse = await request(app).post('/api/v1/user/orders').send({
      cart_id: cartResponse.body.message.cart_id,
      user_id: '646f18ade59581241e5c6b9d'
    }).set('Accept', 'application/json')

    const deliveryResponse = await request(app).put('/api/v1/user/orders/delivery/status').send({
      order_id: orderResponse.body.message.order_id,
      user_id: '646f18ade59581241e5c6b9d',
      status: 'out for delivery'
    }).set('Accept', 'application/json')

    expect(deliveryResponse.statusCode).toBe(201)
    expect(deliveryResponse.body.message.delivery_status).toBe('out for delivery')
  })
  it('Should return order object with delivery status "delivered"', async () => {
    const cartResponse = await request(app).post('/api/v1/user/cart/add').send({
      product_id: '64ae97a075cdbf93a340b7cb',
      qty: 15,
      user_id: '646f18ade59581241e5c6b9d'
    }).set('Accept', 'application/json')

    const orderResponse = await request(app).post('/api/v1/user/orders').send({
      cart_id: cartResponse.body.message.cart_id,
      user_id: '646f18ade59581241e5c6b9d'
    }).set('Accept', 'application/json')

    const deliveryResponse = await request(app).put('/api/v1/user/orders/delivery/status').send({
      order_id: orderResponse.body.message.order_id,
      user_id: '646f18ade59581241e5c6b9d',
      status: 'delivered'
    }).set('Accept', 'application/json')

    expect(deliveryResponse.statusCode).toBe(201)
    expect(deliveryResponse.body.message.delivery_status).toBe('delivered')
  })
  it('Should throw error on object input', async () => {
    const deliveryResponse = await request(app).put('/api/v1/user/orders/delivery/status').send({
      order_id: '',
      user_id: '',
      status: ''
    }).set('Accept', 'application/json')

    expect(deliveryResponse.statusCode).toBe(422)
  })
  it('Should throw error on object when input status not in the option', async () => {
    const cartResponse = await request(app).post('/api/v1/user/cart/add').send({
      product_id: '64ae97a075cdbf93a340b7cb',
      qty: 15,
      user_id: '646f18ade59581241e5c6b9d'
    }).set('Accept', 'application/json')

    const orderResponse = await request(app).post('/api/v1/user/orders').send({
      cart_id: cartResponse.body.message.cart_id,
      user_id: '646f18ade59581241e5c6b9d'
    }).set('Accept', 'application/json')

    const deliveryResponse = await request(app).put('/api/v1/user/orders/delivery/status').send({
      order_id: orderResponse.body.message.order_id,
      user_id: '646f18ade59581241e5c6b9d',
      status: 'unknown'
    }).set('Accept', 'application/json')

    expect(deliveryResponse.statusCode).toBe(500)
  })
})
describe.skip('Search Product API', () => {
  it('Should return products with status 200"', async () => {
    const query = 'name=Product_1&&page=1'
    const queryResponse = await request(app).get(`/api/v1/user?${query}`)

    expect(queryResponse.statusCode).toBe(200)
    expect(queryResponse.body.message).toBeDefined()
  })

  it('Should return with empty query 200"', async () => {
    const query = ''
    const queryResponse = await request(app).get(`/api/v1/user?${query}`)

    expect(queryResponse.statusCode).toBe(200)
    expect(queryResponse.body.message).toBeDefined()
  })

  it('Should return products when exact keyword not provided"', async () => {
    const query = 'name=bestProduct&&page=1'
    const queryResponse = await request(app).get(`/api/v1/user?${query}`)

    expect(queryResponse.statusCode).toBe(200)
    expect(queryResponse.body.message).toBeDefined()
  })
})
