
import CartModel, { CartCore, CartItemCore, CartItemDocument, ORDER_STATUS } from "@models/cartModel"
import CustomError from "@utils/CustomError"
import { Request, Response, NextFunction } from "express"
import ProductModel from '@models/productModel'
import { ProductRepo } from "@repositories/product.repository"
import { ProductCore, ProductDocument } from "types/product.interface"
import { sendHTTPResponse } from "@services/response.services"
import currency from "currency.js"
import { StatusCodes, getReasonPhrase } from "http-status-codes"
import { merge } from "lodash"
import mongoose from "mongoose"
import { CartPrice } from "@utils/price.util"
import FlashSale, { SalesStatus } from "@models/flashSale.model"
import { getTax } from "@utils/tax.util"

const findTotalPrice = async (productId: string, qty: number, productRepo: ProductRepo<ProductDocument>) => {
    const product = await productRepo.findProductById(productId)
    return currency(product?.price as number).multiply(qty).value

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

/* Updated utils */

const getPricePerQuantity = async (productId: string, qty: number,) => {
    return await ProductModel.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(productId) // Convert productId to ObjectId if it's a string
            }
        },
        {
            $project: {
                totalPrice: {
                    $multiply: ['$price', qty] // Multiply price with input quantity
                },
                _id: 0
            }
        }
    ])
}
const totalQty = (products: Record<string, CartItemCore>): number => {
    return Object.values(products).reduce((totalQty, item) => totalQty + item.qty, 0);
}
const getGrandTotal = (products: Record<string, CartItemCore>) => {
    const productsArray = Object.values(products)
    let total = 0;
    for (let item of productsArray) {
        total = currency(total).add(item.totalPriceAfterTax).value
    }
    return total.toFixed();
}

export const add = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {

        const cartItems = req.body
        const cart: CartCore = {
            userId: new mongoose.Types.ObjectId(req.user.id),
            products: {},
            grandTotalPrice: 0,
            grandTotalQty: 0
        }

        const gstInPercentage = 12
        for (let item of cartItems) {
            const cartItem = item
            const calculatePricePerQuantity = await getPricePerQuantity(cartItem.productId, cartItem.qty)
            const product = await ProductModel.findById(cartItem.productId).select({ stock: 1, name: 1 })
            if (!product) { next(new CustomError(getReasonPhrase(StatusCodes.NOT_FOUND), StatusCodes.NOT_FOUND, false)); return }
            if (product.stock < cartItem.qty) {
                return next(new CustomError(`${product.name} is OUT OF STOCK`, StatusCodes.NOT_FOUND, false))
            }


            const totalPrice = Number(calculatePricePerQuantity[0].totalPrice)

            const price = new CartPrice(totalPrice)
            const orderItem: CartItemCore = {
                product: cartItem.productId,
                qty: cartItem.qty,
                options: cartItem.options,
                orderStatus: ORDER_STATUS.NOT_PROCESSED,
                totalPrice: price.getInitialPrice(),
                gstInPercentage,
                taxAmount: price.getTaxAmount(),
                totalPriceBeforeTax: price.getInitialPrice(),
                totalPriceAfterTax: price.getMRP(),
            }

            cart.products[item.productId] = orderItem
            product.stock -= Number(cartItem.qty)
            product.modifiedPaths()
            await product.save()

        }

        cart.grandTotalQty = totalQty(cart.products)
        cart.grandTotalPrice = Number(getGrandTotal(cart.products))

        const mycart = (await (await CartModel.create(cart)).populate('products.$*.product')).toObject({ flattenMaps: true })
        const cartId = mycart._id
        delete mycart._id
        delete mycart.__v
        delete mycart.createdAt
        merge(mycart, { cartId })
        sendHTTPResponse({ res, message: { mycart }, statusCode: StatusCodes.CREATED, success: true })
    } catch (error: unknown) {
        const errorObj = error as CustomError
        next(new CustomError(errorObj.message, errorObj.code, false))
    }
}
export const addFlashCart = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {

        const cartItems = req.body
        const cart: CartCore = {
            userId: new mongoose.Types.ObjectId(req.user.id),
            products: {},
            grandTotalPrice: 0,
            grandTotalQty: 0
        }

        const gstInPercentage = 12
        for (let item of cartItems) {
            const cartItem = item
            const calculatePricePerQuantity = await getPricePerQuantity(cartItem.productId, cartItem.qty)
            const product = await ProductModel.findById(cartItem.productId).select({ stock: 1, name: 1 })
            if (!product) { next(new CustomError(getReasonPhrase(StatusCodes.NOT_FOUND), StatusCodes.NOT_FOUND, false)); return }


            const flashsale = await FlashSale.findOne({ 'product': cartItem.productId })

            if (!flashsale) {
                return next(new CustomError(`${product.name} is not available`, StatusCodes.NOT_FOUND, false))
            }
            if (new Date() < new Date(flashsale.startTime)) {
                return next(new CustomError(`${product.name} flash sale not started`, StatusCodes.NOT_FOUND, false))
            }
            if (flashsale?.currentStock < cartItem.qty) {
                return next(new CustomError(`${product.name} is OUT OF STOCK`, StatusCodes.NOT_FOUND, false))
            }
            if (flashsale.users?.usedBy.includes(req.user.id)) {
                return next(new CustomError(`You cannot purchase again`, StatusCodes.NOT_FOUND, false))
            }
            if (new Date() > new Date(flashsale.endTime)) {
                return next(new CustomError(`${product.name} flash sale ended`, StatusCodes.NOT_FOUND, false))
            }
            const totalPrice = Number(calculatePricePerQuantity[0].totalPrice)

            const price = new CartPrice(totalPrice)
            const orderItem: CartItemCore = {
                product: cartItem.productId,
                qty: 1,
                options: cartItem.options,
                orderStatus: ORDER_STATUS.NOT_PROCESSED,
                totalPrice: flashsale.priceAfterDiscount!,
                gstInPercentage,
                taxAmount: getTax(flashsale.priceAfterDiscount!),
                totalPriceBeforeTax: flashsale.priceAfterDiscount!,
                totalPriceAfterTax: Math.floor(flashsale.priceAfterDiscount! + getTax(flashsale.priceAfterDiscount!)),
            }

            cart.products[item.productId] = orderItem

            product.modifiedPaths()
            await product.save()
            flashsale.currentStock -= 1
            flashsale.users?.usedBy.push(req.user.id)
            flashsale.modifiedPaths()
            await flashsale.save()

        }

        cart.grandTotalQty = totalQty(cart.products)
        cart.grandTotalPrice = Number(getGrandTotal(cart.products))

        const mycart = (await (await CartModel.create(cart)).populate('products.$*.product')).toObject({ flattenMaps: true })
        const cartId = mycart._id
        delete mycart._id
        delete mycart.__v
        delete mycart.createdAt
        merge(mycart, { cartId })
        sendHTTPResponse({ res, message: { mycart }, statusCode: StatusCodes.CREATED, success: true })
    } catch (error: unknown) {
        const errorObj = error as CustomError
        next(new CustomError(errorObj.message, errorObj.code, false))
    }
}
export const setFlashSaleStatus = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {

        const statusmap:Record<string,string> = {
            'a': SalesStatus.ACTIVE,
            'p': SalesStatus.PENDING,
            'e' : SalesStatus.EXPIRED
        }

        const cartItems = req.body
        const flashsale = await FlashSale.findById(req.params.flashsaleId)
        if (!flashsale) {
            return next(new CustomError(`Sale is not available`, StatusCodes.NOT_FOUND, false))
        }
        flashsale.status = statusmap[(req.body.status as string).toLowerCase()]
        flashsale.modifiedPaths()
        await flashsale?.save()
        sendHTTPResponse({ res, message: { flashsale }, statusCode: StatusCodes.CREATED, success: true })
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

        // myCart.grandTotalPriceString = rupee.format(myCart.grandTotalPrice)
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

        const myCart = await CartModel.findOne({ userId: req.user.id }).select('-__v -createdAt').populate({
            path: 'products.$*.product'
        }).lean()

        if (!myCart) { next(new CustomError(getReasonPhrase(StatusCodes.NOT_FOUND), StatusCodes.NOT_FOUND, false)); return }

        const cartId = myCart._id
        delete myCart._id
        merge(myCart, { cartId })


        sendHTTPResponse({ res, message: { cart: myCart }, statusCode: 200, success: true })

    } catch (error: unknown) {
        const errorObj = error as CustomError
        next(new CustomError(errorObj.message, errorObj.code, false))
    }
}
export const getCartAndUserIds = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {

        const myCart = await CartModel.findOne({ userId: req.user.id })

        if (!myCart) { next(new CustomError(getReasonPhrase(StatusCodes.NOT_FOUND), StatusCodes.NOT_FOUND, false)); return }


        sendHTTPResponse({ res, message: { cart: { cartId: myCart._id, userId: req.user.id } }, statusCode: 200, success: true })

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

        myCart.modifiedPaths()
        const userCart = (await (await myCart.save()).populate('products.$*.product')).toObject({ flattenMaps: true })
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