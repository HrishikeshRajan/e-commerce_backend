import { type Model } from 'mongoose'
import { type ICART } from '../models/cartModel'
import { type Product, type CART_ITEM } from '../types/product.interface'
import { type CART_MODEL } from '../types/Cart.interfaces'

export class CartRepository {
  private readonly cart: Model<ICART> | null = null

  private items: CART_ITEM[]
  constructor (cart: Model<ICART>) {
    this.cart = cart
    this.items = []
  };

  private async saveToCartDB (cart: ICART): Promise<ICART> {
    const result = await cart.save()
    return result
  }

  private calculateTotalQty (): number {
    let sum = 0
    const items = this.getCartState()
    for (let i = 0; i < items.length; i++) {
      sum += items[i].qty
    }
    return sum
  }

  private calculateTotal (item: CART_ITEM): number {
    return Math.floor(item.qty * item.price)
  }

  private calculateSubTotal (): number {
    const items = this.getCartState()
    const subTotal = Math.floor(items.reduce((accumulator, currentItem) => accumulator + currentItem.total, 0))
    return subTotal
  }

  private createCartModel ({ totalCartQty, userId, subTotal }: { totalCartQty: number, userId: string, subTotal: number }): CART_MODEL {
    const userCart = {
      products: this.getCartState(),
      userId,
      subTotal,
      totalQty: totalCartQty

    }
    return userCart
  }

  private cleanCartResponse (cart: any): any {
    const response = {
      products: cart.products,
      userId: cart.userId.toString(),
      totalQty: cart.totalQty,
      subTotal: cart.subTotal,
      currencyCode: cart.currencyCode,
      cartStatus: cart.cartStatus,
      _id: cart._id.toString()
    }

    this.items = []
    return response
  }

  private updateCartState (product: CART_ITEM): void {
    this.items.push(product)
  }

  private setCartState (products: CART_ITEM[]): void {
    this.items = products
  }

  private getCartState (): CART_ITEM [] {
    return this.items
  }

  private clearCartState (): void {
    this.items.length = 0
  }

  public async createNewCart (cartItems: CART_MODEL): Promise<ICART | null> {
    const result = await this.cart?.create(cartItems)
    if (result === undefined) return null
    return result
  }

  public async findCartByUserId (userId: string): Promise<ICART | null> {
    const cart = await this.cart?.findOne({ userId })
    if (cart === null || cart === undefined) return null
    return cart
  }

  public async addToCart (params: { cartItem: CART_ITEM, userId: string, product: Product }): Promise<CART_MODEL | null> {
    const cartItem = { ...params.cartItem }
    const userId = params.userId.toString()
    const productPrice = params.product.price
    const productId = params.product._id.toString()
    const myCart = await this.findCartByUserId(userId)

    cartItem.productId = productId
    cartItem.price = productPrice
    const total = this.calculateTotal(cartItem)
    cartItem.total = total

    this.updateCartState(cartItem)

    // total quantity
    const totalCartQty = this.calculateTotalQty()
    const subTotal = this.calculateSubTotal()

    const cartModel = this.createCartModel({ totalCartQty, userId, subTotal })
    const productExists = myCart?.products.find((item) => item.productId.toString() === productId.toString())

    if (myCart === null) {
      const newCart = await this.createNewCart(cartModel)

      return this.cleanCartResponse(newCart)
    } else if (myCart != null && (productExists != null)) {
      myCart.products.map((item) => {
        if (item.productId.toString() === productId.toString()) {
          item.qty++
          item.total = this.calculateTotal(item)
          return true
        }
        return false
      })

      this.setCartState(myCart.products)
      myCart.subTotal = this.calculateSubTotal()
      myCart.totalQty = this.calculateTotalQty()
      const updatedCart = await this.saveToCartDB(myCart)
      return this.cleanCartResponse(updatedCart)
    } else {
      myCart.products.push(cartItem)
      this.setCartState(myCart.products)

      myCart.subTotal = this.calculateSubTotal()
      myCart.totalQty = this.calculateTotalQty()
      const updatedCart = await this.saveToCartDB(myCart)
      return this.cleanCartResponse(updatedCart)
    }
  }

  public async deleteCart (id: string): Promise<this | null> {
    const myCart = await this.findCartByUserId(id)
    if (myCart === null) return null
    const cartId = myCart?._id
    await this.cart?.findByIdAndDelete(cartId)

    this.clearCartState()
    return this
  }

  public async findCartByCartId (cartId: string): Promise<ICART | null> {
    const cart = await this.cart?.findById(cartId)
    if (cart === null || cart === undefined) return null
    return cart
  }

  public async findCartAndChangeQty (userId: string, qty: number, product: Product): Promise<ICART | null> {
    const cart = await this.findCartByUserId(userId)

    if (cart === null || cart === undefined) return null

    if (qty === 0) {
      const filteredCart = cart.products.filter((item) => item.productId.toString() !== product._id.toString())
      if (filteredCart === null || filteredCart === undefined) return null

      this.setCartState(filteredCart)
      cart.products = this.getCartState()
      cart.subTotal = this.calculateSubTotal()
      cart.totalQty = this.calculateTotalQty()
      const savedCart = await this.saveToCartDB(cart)
      const result = this.cleanCartResponse(savedCart)
      return result
    }
    cart.products.find((item) => {
      if (item.productId.toString() === product._id.toString()) {
        item.qty = qty
        item.total = this.calculateTotal(item)
        return true
      }
      return false
    })

    this.setCartState(cart.products)
    cart.subTotal = this.calculateSubTotal()
    cart.totalQty = this.calculateTotalQty()

    const savedCart = await this.saveToCartDB(cart)

    const result = this.cleanCartResponse(savedCart)
    return result
  }
}
