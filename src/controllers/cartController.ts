
import CartModel, { CartItemDocument } from "@models/cartModel"
import CustomError from "@utils/CustomError"
import { Request, Response, NextFunction } from "express"
import ProductModel from '@models/productModel'
import { ProductRepo } from "@repositories/product.repository"
import { ProductCore, ProductDocument } from "types/product.interface"
import { sendHTTPResponse } from "@services/response.services"
import currency from "currency.js"
import { StatusCodes, getReasonPhrase } from "http-status-codes"
import { replaceCartIdsWithProducts } from "@utils/joinProducts"
export interface Options {
    color: string
    size: string
}
export type Item = {
    product: ProductCore,
    qty: number
    totalPrice: number
    options: Options
};




const sumQty = (products: Map<string, CartItemDocument>): number => {
    return Object.values(products).reduce((totalQty, item) => totalQty + item.qty, 0);
}
const findTotalPrice = async (productId: string, qty: number, productRepo: ProductRepo<ProductDocument>) => {
    const product = await productRepo.findProductById(productId)
    return currency(product?.price as number).multiply(qty).value
}

const findGrandTotal = (products: Map<string, CartItemDocument>) => {
    const productsArray = Object.values(products)
    let total = 0;
    for (let item of productsArray) {
        console.log(item.totalPrice)
        total = currency(total).add(item.totalPrice).value
    }
    return total;
}

const calculateGrandTotal = (products: Map<string, CartItemDocument>) => {
    const productsArray = Array.from(products)
    let total = 0;
    for (let item of productsArray) {
        console.log(item)
        total = currency(total).add(item[1].totalPrice).value
    }
    return total;
}
const calculateTotalQty = (products: Map<string, CartItemDocument>) => {
    const productsArray = Array.from(products)
    let total = 0;
    for (let item of productsArray) {
        console.log(item)
        total += item[1].qty
    }
    return total;
}
export const add = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const productRepo = new ProductRepo<ProductDocument>(ProductModel)
        const cart = req.body
        cart.cart.grandTotalQty = sumQty(cart.cart.products)
        cart.cart.userId = req.user.id

        for (let [key] of Object.entries(req.body.cart.products)) {
            const cartItem = cart.cart.products[key]
            const totalPrice = await findTotalPrice(key, cartItem.qty, productRepo)
            cartItem.totalPrice = totalPrice
        }

        cart.cart.grandTotalPrice = findGrandTotal(cart.cart.products)
        const userCart = await CartModel.create(req.body.cart)
        const data = await replaceCartIdsWithProducts(userCart)
        sendHTTPResponse({ res, message: data, statusCode: 200, success: true })


    } catch (error: unknown) {
        const errorObj = error as CustomError
        next(new CustomError(errorObj.message, errorObj.code, false))
    }
}

export const updateQty = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {

        const productRepo = new ProductRepo<ProductDocument>(ProductModel)
        const myCart = await CartModel.findById(req.params.cartId).select('-__v -createdAt -updatedAt')

        if (!myCart) return
        const product = myCart.products.get(req.params.productId)!

        product.qty = req.body.qty
        product.totalPrice = await findTotalPrice(req.params.productId, req.body.qty, productRepo)


        myCart.products.set(req.params.productId, product)!

        myCart.grandTotalPrice = calculateGrandTotal(myCart.products)

        myCart.grandTotalQty = calculateTotalQty(myCart.products)


        myCart.modifiedPaths()
        const result = await myCart.save()
        const data = await replaceCartIdsWithProducts(result)
        sendHTTPResponse({ res, message: data, statusCode: 200, success: true })

    } catch (error: unknown) {
        const errorObj = error as CustomError
        next(new CustomError(errorObj.message, errorObj.code, false))
    }
}
export const updateSize = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {

        const myCart = await CartModel.findById(req.params.cartId).select('-__v')
        if (!myCart) return
        const product = myCart.products.get(req.params.productId)!
        product.options!.size = req.body.size
        myCart.products.set(req.params.productId, product)
        myCart.modifiedPaths()
        const result = await myCart.save()
        const data = await replaceCartIdsWithProducts(result)
        sendHTTPResponse({ res, message: data, statusCode: 200, success: true })

    } catch (error: unknown) {
        const errorObj = error as CustomError
        next(new CustomError(errorObj.message, errorObj.code, false))
    }
}
export const get = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {

        const myCart = await CartModel.findOne({ userId: '659e76f841083740ad7fae3d' })
        if (!myCart) return

        sendHTTPResponse({ res, message: { cart: myCart }, statusCode: 200, success: true })

    } catch (error: unknown) {
        const errorObj = error as CustomError
        next(new CustomError(errorObj.message, errorObj.code, false))
    }
}

export const deleteCart = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const isDeleted = await CartModel.findByIdAndDelete(req.params.cartId)
        if (!isDeleted) return

        sendHTTPResponse({ res, message: { cart: isDeleted }, statusCode: 200, success: true })

    } catch (error: unknown) {
        const errorObj = error as CustomError
        next(new CustomError(errorObj.message, errorObj.code, false))
    }
}

export const deleteProduct = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const myCart = await CartModel.findById(req.params.cartId)
        if (!myCart) { next(new CustomError(getReasonPhrase(StatusCodes.NOT_FOUND), StatusCodes.NOT_FOUND, false)); return }
        if (!myCart.products.get(req.params.productId)) {
            { next(new CustomError(`Product ${getReasonPhrase(StatusCodes.NOT_FOUND)}`, StatusCodes.NOT_FOUND, false)); return }
        }
        myCart.products.delete(req.params.productId)!
        myCart.grandTotalPrice = calculateGrandTotal(myCart.products)

        myCart.grandTotalQty = calculateTotalQty(myCart.products)
        myCart.modifiedPaths()
        const result = await myCart.save()
        sendHTTPResponse({ res, message: { result }, statusCode: 200, success: true })

    } catch (error: unknown) {
        const errorObj = error as CustomError
        next(new CustomError(errorObj.message, errorObj.code, false))
    }
}