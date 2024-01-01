import { type Model } from 'mongoose'
import { type ICART } from '../models/cartModel'
import { type IORDER, type ORDER } from '../models/orderModel'
import { type Address, type IUser, type IAddress } from '../types/IUser.interfaces'
import { type CART_ITEM } from '../types/product.interface'

export class OrderManagement {
  private readonly order: ORDER

  constructor () {
    this.order = {
      products: [],
      grandTotal: 0,
      totalQuantity: 0,
      currencyCode: '',
      orderStatus: '',
      shippingAddress: {
        fullname: '',
        city: '',
        homeAddress: '',
        state: '',
        postalCode: '',
        phoneNo: '',
        country: ''
      },
      paymentMethod: '',
      paymentStatus: '',
      paymentId: '',
      discountPercentage: 0,
      isDiscountApplied: false,
      priceAfterDiscount: 0,
      savedAmount: 0,
      userId: ''
    }
  }

  setProducts (cart: ICART): this {
    this.order.products = cart.products
    return this
  }

  getProducts (): CART_ITEM[] {
    return this.order.products
  }

  setGrandTotal (grandTotal: number): this {
    this.order.grandTotal = grandTotal
    return this
  }

  getGrandTotal (): number {
    return this.order.grandTotal
  }

  setTotalQuantity (totalQuantity: number): this {
    this.order.totalQuantity = totalQuantity
    return this
  }

  getTotalQuantity (): number {
    return this.order.totalQuantity
  }

  setCurrencyCode (currencyCode: string): this {
    this.order.currencyCode = currencyCode
    return this
  }

  getCurrencyCode (): string {
    return this.order.currencyCode
  }

  setOrderStatus (orderStatus: string): this {
    this.order.orderStatus = orderStatus
    return this
  }

  getOrderStatus (): string {
    return this.order.orderStatus
  }

  setShippingAddress (address: IAddress): this {
    this.order.shippingAddress = address
    return this
  }

  getShippingAddress (): Address {
    return this.order.shippingAddress
  }

  setPaymentMethod (paymentMethod: string): this {
    this.order.paymentMethod = paymentMethod
    return this
  }

  getPaymentMethod (): string {
    return this.order.paymentMethod
  }

  setPaymentStatus (paymentStatus: string): this {
    this.order.paymentStatus = paymentStatus
    return this
  }

  getPaymentStatus (): string {
    return this.order.paymentStatus
  }

  setPaymentId (paymentId: string): this {
    this.order.paymentId = paymentId
    return this
  }

  getPaymentId (): string {
    return this.order.paymentId
  }

  setUserId (userId: IUser['_id']): this {
    this.order.userId = userId
    return this
  }

  getUserId (): IUser['_id'] {
    return this.order.userId
  }

  calculateDiscount (): this {
    this.order.priceAfterDiscount = Math.floor(this.getGrandTotal() - (this.getGrandTotal() * (this.getDiscount() / 100)))
    return this
  }

  setDiscount (percentage: number): this {
    this.order.discountPercentage = percentage
    this.calculateDiscount()
    return this
  }

  getDiscount (): number {
    return this.order.discountPercentage
  }

  setDiscountApplied (): this {
    this.order.isDiscountApplied = true
    return this
  }

  getIsDiscountApplied (): boolean {
    return this.order.isDiscountApplied
  }

  calculateSavedAmount (): number {
    return this.order.grandTotal - this.order.priceAfterDiscount
  }

  setSavedAmount (): this {
    this.order.savedAmount = this.calculateSavedAmount()
    return this
  }

  getOrder (): ORDER {
    return this.order
  }
}

export class OrdeDB {
  OrderModel: Model<IORDER>
  constructor (order: Model<IORDER>) {
    this.OrderModel = order
  }

  async createOrder (order: ORDER): Promise<IORDER> {
    return await this.OrderModel.create(order)
  }
}
