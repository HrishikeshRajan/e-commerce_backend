
import CartModel, { CartItemCore, CartItemDocument, ORDER_STATUS } from "@models/cartModel"
import CustomError from "@utils/CustomError"
import { Request, Response, NextFunction } from "express"
import ProductModel from '@models/productModel'
import { ProductRepo } from "@repositories/product.repository"
import { ProductCore, ProductDocument } from "types/product.interface"
import { sendHTTPResponse } from "@services/response.services"
import currency from "currency.js"
import { StatusCodes, getReasonPhrase } from "http-status-codes"
import { merge } from "lodash"



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
        total = currency(total).add(item.totalPriceAfterTax).value
    }
    return total;
}
const updateGrandTotal = (products: Map<string, CartItemDocument>) => {
    const productsArray = Array.from(products)
    let total = 0;
    for (let [key, item] of productsArray) {
        total = currency(total).add(item.totalPriceAfterTax).value
    }
    return total;
}

const calculateTotalQty = (products: Map<string, CartItemDocument>) => {
    const productsArray = Array.from(products)
    let total = 0;
    for (let item of productsArray) {
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
        let rupee = new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
        });

        cart.cart.userId = req.user.id
        const gstInPercentage = 12

        for (let [key, item] of Object.entries(req.body.cart.products)) {
            const cartItem = cart.cart.products[key]
            const totalPrice = await findTotalPrice(key, cartItem.qty, productRepo)
            const tax = currency(totalPrice).multiply(gstInPercentage).divide(100)
            const orderItem: CartItemCore = {
                productId: cartItem.productId,
                qty: cartItem.qty,
                options: cartItem.options,
                orderStatus: ORDER_STATUS.NOT_PROCESSED,
                totalPrice,
                gstInPercentage,
                taxAmount: tax.value,
                totalPriceBeforeTax: totalPrice,
                totalPriceAfterTax: Math.round(totalPrice + tax.value),

            }
            let rupee = new Intl.NumberFormat('en-IN', {
                style: 'currency',
                currency: 'INR',
            });

            merge(orderItem, { totalPriceAfterTaxString: rupee.format(Math.round(totalPrice + tax.value)) })

            cart.cart.products[key] = orderItem
        }
        cart.cart.grandTotalQty = sumQty(cart.cart.products)
        cart.cart.grandTotalPrice = findGrandTotal(cart.cart.products)
        cart.cart.grandTotalPriceString = rupee.format(cart.cart.grandTotalPrice)
        const userCart = await(await(await CartModel.create(cart.cart)).populate('products.$*.productId')).toObject({ flattenMaps: true })
        const cartId = userCart._id
        delete userCart._id
        delete userCart.__v
        delete userCart.createdAt
        delete userCart.updatedAt
        merge(userCart, { cartId })

        sendHTTPResponse({ res, message: { cart: userCart }, statusCode: 200, success: true })


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

        if (!myCart) { next(new CustomError(getReasonPhrase(StatusCodes.NOT_FOUND), StatusCodes.NOT_FOUND, false)); return }

        const product = myCart.products.get(req.params.productId)!
        if (!product) { next(new CustomError(getReasonPhrase(StatusCodes.NOT_FOUND), StatusCodes.NOT_FOUND, false)); return }

        product.qty = req.body.qty
        const totalPrice = await findTotalPrice(req.params.productId, req.body.qty, productRepo)
        product.totalPrice = totalPrice
        product.taxAmount = currency(product.totalPrice).multiply(product.gstInPercentage).divide(100).value
        product.totalPriceBeforeTax = totalPrice
        product.totalPriceAfterTax = Math.round(totalPrice + product.taxAmount)
        let rupee = new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
        });

        merge(product, { totalPriceAfterTaxString: rupee.format(Math.round(totalPrice + product.taxAmount)) })

        myCart.products.set(req.params.productId, product)!

        myCart.grandTotalPrice = updateGrandTotal(myCart.products)

        myCart.grandTotalQty = calculateTotalQty(myCart.products)

        myCart.grandTotalPriceString = rupee.format(myCart.grandTotalPrice)
        myCart.modifiedPaths()
        const userCart = (await (await myCart.save()).populate('products.$*.productId')).toObject({ flattenMaps: true })
        const cartId = userCart._id
        delete userCart._id
        delete userCart.__v
        delete userCart.updatedAt
        merge(userCart, { cartId })

        merge(userCart, { grandTotalPriceString: rupee.format(myCart.grandTotalPrice) })
        sendHTTPResponse({ res, message: { cart: userCart }, statusCode: 200, success: true })

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
        const myCart = await CartModel.findById(req.params.cartId).select('-__v -createdAt -updatedAt')
        if (!myCart) { next(new CustomError(getReasonPhrase(StatusCodes.NOT_FOUND), StatusCodes.NOT_FOUND, false)); return }

        const product = myCart.products.get(req.params.productId)!
        if (!product) { next(new CustomError(getReasonPhrase(StatusCodes.NOT_FOUND), StatusCodes.NOT_FOUND, false)); return }

        product.options!.size = req.body.size
        let rupee = new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
        });

        merge(product, { totalPriceAfterTaxString: rupee.format(Math.round(product.totalPrice + product.taxAmount)) })

        myCart.products.set(req.params.productId, product)
        myCart.modifiedPaths()
        const userCart = (await (await myCart.save()).populate('products.$*.productId')).toObject({ flattenMaps: true })
        const cartId = userCart._id
        delete userCart._id
        delete userCart.__v
        delete userCart.updatedAt
        merge(userCart, { cartId })
        sendHTTPResponse({ res, message: { cart: userCart }, statusCode: 200, success: true })

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
        if (!isDeleted) { next(new CustomError(getReasonPhrase(StatusCodes.NOT_FOUND), StatusCodes.NOT_FOUND, false)); return }

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
        let rupee = new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
        });
        if (!myCart) { next(new CustomError(getReasonPhrase(StatusCodes.NOT_FOUND), StatusCodes.NOT_FOUND, false)); return }
        if (!myCart.products.get(req.params.productId)) {
            { next(new CustomError(`Product ${getReasonPhrase(StatusCodes.NOT_FOUND)}`, StatusCodes.NOT_FOUND, false)); return }
        }
        myCart.products.delete(req.params.productId)!


        myCart.grandTotalPrice = updateGrandTotal(myCart.products)

        myCart.grandTotalQty = calculateTotalQty(myCart.products)
        myCart.grandTotalPriceString = rupee.format(myCart.grandTotalPrice)

        myCart.modifiedPaths()
        const userCart = (await (await myCart.save()).populate('products.$*.productId')).toObject({ flattenMaps: true })
        const cartId = userCart._id
        delete userCart._id
        delete userCart.__v
        delete userCart.updatedAt
        merge(userCart, { cartId })

        sendHTTPResponse({ res, message: { cart: userCart }, statusCode: 200, success: true })


    } catch (error: unknown) {
        const errorObj = error as CustomError
        next(new CustomError(errorObj.message, errorObj.code, false))
    }
}