
import CartModel, { CartCore, CartDocument, CartItemCore, CartItemDocument, ORDER_STATUS } from "@models/cartModel"
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
import PromoModel, { PromoDocument } from "@models/promoModel"
import { AppliedPromo, Promo } from "types/CouponManagement"
import { IUser } from "types/IUser.interfaces"

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
// const getGrandTotal = (products: Record<string, CartItemCore>) => {
//     const productsArray = Object.values(products)
//     let total = 0;
//     for (let item of productsArray) {
//         total = currency(total).add(item.totalPriceAfterTax).value
//     }
//     return total.toFixed();
// }

export const getGrandTotal = (products: Record<string, CartItemCore>) => {
    const productsArray = Object.values(products);
    let total = 0;
    for (const item of productsArray) {
      if (item.appliedOffer?.couponId) {
        total = currency(total).add(item.appliedOffer.discountedPriceAftTax).value;
      } else {
        total = currency(total).add(item.totalPriceAfterTax).value;
      }
    }
    return total.toFixed();
  };
export type PromoArgsSuccess = {
    cartItem: CartItemDocument;
    couponIndex: number
};

// export function findCartItemsByCode(codeToFind: string, cartItems: CartItemDocument[]) {
//     if (!cartItems.length) return null;
//     const arr: PromoArgsSuccess[] = [];
//     for (let i = 0; i < cartItems.length; i += 1) {
//         const cartItem = cartItems[i];
//         const couponIndex = cartItem.offers.coupons.findIndex((coupon) => coupon.code === codeToFind);
//         if (couponIndex !== -1) {
//             const result: PromoArgsSuccess = { cartItem, couponIndex };
//             arr.push(result);
//         }
//     }
//     return arr;
// }

export function isNull<T>(response: T | null): response is null {
    return response === null;
}

export function isPromoCodeAssignedToProduct(item: any, promo: Promo) {
    return promo.tags.products && promo.tags.products.indexOf(item.productId) < 0
}
export function isCouponActivated(promo: Promo) {
    const currentDate = new Date();
    const startDate = new Date(promo.startTime);
    return (currentDate > startDate);
}

export function isCouponExpired(promo: Promo) {
    const currentDate = new Date();
    const endDate = new Date(promo.endTime);
    return currentDate > endDate;
}

export function isCouponAtUsageLimit(promo: Promo) {
    return (Number(promo.maxUsage) < 1);
}

export function isMinimumAmountPresentInCart(promo: Promo, usercart: CartCore) {
    return (usercart.grandTotalPrice > promo.minAmountInCart);
}
export type Percentage = {
    type: 'PERCENTAGE',
    originalAmount: number,
    discountPercentage: number,
    discountedPrice: number,
    tax: number,
    discountedPriceAftTax: number,
    yourSavings: number
    couponId: string
    productId?: string
    promoCode: string
};
export type Flat = {
    type: 'FLAT',
    originalAmount: number,
    discountFixedAmount: number,
    discountedPrice: number,
    tax: number
    discountedPriceAftTax: number,
    yourSavings: number
    couponId: string
    productId?: string
    promoCode: string
};
/**
 * 
 * Discount calculation API
 * 
 * 
 */

export function getFixedDiscountAmount(promo: Promo) {
    if (promo.type === 'FLAT') {
        return promo.discountAmount;
    }
    return -1;
}
export function computeDiscountAmount(originalPrice: number, amountToDiscount: number) {
    return currency(originalPrice).subtract(amountToDiscount).value;
}
export function computeTax(totalPriceBeforeTax: number, gstInPercentage: number) {
    const tax = currency(totalPriceBeforeTax).multiply(gstInPercentage).divide(100);
    return tax.value;
}

export function getProductId(cartItem: CartItemCore) {
    return cartItem.product;
}

export function getUserId(userStore: IUser) {
    return userStore._id;
}

export function computeSavings(cartItem: CartItemCore, promo: Promo) {
    const discountPercentage = promo.discountPercentage || 100;
    const savings = (cartItem.totalPrice / 100) * discountPercentage;
    return savings;
}

export function getDiscountPercentage(promo: Promo) {
    if (promo.type === 'PERCENTAGE') {
        return promo.discountPercentage;
    }
    return null;
}

export function applyPercentageDiscount(cartItem: CartItemCore, promo: Promo, gstInPercentage: number) {
    let promoObject: Percentage;
    if (promo.type === 'PERCENTAGE') {
        const savings = computeSavings(cartItem, promo);
        promoObject = {
            type: 'PERCENTAGE',
            originalAmount: cartItem.totalPrice,
            discountPercentage: getDiscountPercentage(promo) ?? 0,
            discountedPrice: computeDiscountAmount(cartItem.totalPrice, savings),
            tax: computeTax(computeDiscountAmount(cartItem.totalPrice, getFixedDiscountAmount(promo) ?? 0), gstInPercentage),
            discountedPriceAftTax: computeDiscountAmount(cartItem.totalPrice, savings) + computeTax(computeDiscountAmount(cartItem.totalPrice, savings), gstInPercentage),
            yourSavings: cartItem.totalPrice - computeDiscountAmount(cartItem.totalPrice, savings),
            couponId: promo._id,
            promoCode: promo.code,
            productId: String(getProductId(cartItem)),

        };
        return promoObject;
    }
    return undefined
}


export function applyFlatDiscount(cartItem: CartItemCore, promo: Promo, gstInPercentage: number) {
    console.log(getProductId(cartItem), cartItem)
    let promoObject: Flat;
    if (promo.type === 'FLAT') {
        promoObject = {
            type: 'FLAT',
            originalAmount: cartItem.totalPrice,
            discountFixedAmount: getFixedDiscountAmount(promo) ?? 0,
            discountedPrice: computeDiscountAmount(cartItem.totalPrice, getFixedDiscountAmount(promo) ?? 0),
            tax: computeTax(computeDiscountAmount(cartItem.totalPrice, getFixedDiscountAmount(promo) ?? 0), gstInPercentage),
            discountedPriceAftTax: computeDiscountAmount(cartItem.totalPrice, getFixedDiscountAmount(promo) ?? 0) + computeTax(computeDiscountAmount(cartItem.totalPrice, getFixedDiscountAmount(promo) ?? 0), gstInPercentage),
            yourSavings: getFixedDiscountAmount(promo) ?? 0,
            couponId: promo._id,
            productId: String(getProductId(cartItem)),
            promoCode: promo.code,
        };
        return promoObject;
    }
    return undefined
}

export function isPromoApplied(cartItem: CartItemCore & { appliedOffer: AppliedPromo }) {
    return cartItem.appliedOffer !== undefined;
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
            if (!product) { next(new CustomError(getReasonPhrase(` Product: ${cartItem.productId} ${StatusCodes.NOT_FOUND}`), StatusCodes.NOT_FOUND, false)); return }
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



        const uniqProducts = new Set<string>();
        for (let item of cartItems) {
            if (item.promoCode) {
                const promo = await PromoModel.findOne<PromoDocument | null>({ code: item.promoCode })

                if (isNull<Promo>(promo)) {
                    return next(new CustomError('This coupon is not applicable', StatusCodes.NOT_FOUND, false));
                }

                if (isPromoCodeAssignedToProduct(item, promo)) {
                    return next(new CustomError('This coupon is not applicable to any product', StatusCodes.NOT_FOUND, false));
                }


                if (!isCouponActivated(promo)) {
                    return next(new CustomError('Promo code is not activated ', StatusCodes.NOT_FOUND, false));
                }


                if (isCouponExpired(promo)) {
                    return next(new CustomError('Promo Code is expired ', StatusCodes.NOT_FOUND, false))
                }

                if (isCouponAtUsageLimit(promo)) {
                    return next(new CustomError('Global coupon limit exceed', StatusCodes.NOT_FOUND, false));
                }

                if (!isMinimumAmountPresentInCart(promo, cart)) {
                    return next(new CustomError(`Unable to apply. Cart Should contain minimum ${promo.minAmountInCart}}`, StatusCodes.NOT_FOUND, false));
                }

                //user already used
                const hasCouponBeenRedeemed = promo.usedBy.find(user => user.userId.toString() === req.user.id.toString())

                if (hasCouponBeenRedeemed && (hasCouponBeenRedeemed.count > promo.maxUsagePerUser)) {
                    return next(new CustomError('Your coupon reached maximum', StatusCodes.NOT_FOUND, false));
                }


                //Now rework the offer apply

                let cartItem = cart.products[item.productId] as CartItemCore & { appliedOffer: AppliedPromo }

                if (promo.type === 'FLAT') {
                    const promoObject = applyFlatDiscount(cartItem, promo, gstInPercentage);
                    if (!isPromoApplied(cartItem)) {
                        if (promoObject) {
                            cartItem.appliedOffer = promoObject
                        }
                    }
                }

                if (promo.type === 'PERCENTAGE') {
                    const promoObject = applyFlatDiscount(cartItem, promo, gstInPercentage);
                    if (!isPromoApplied(cartItem)) {
                        if (promoObject) {
                            cartItem.appliedOffer = promoObject
                        }
                    }
                }

                cart.products[item.productId] = cartItem

                let usedUserIndex = promo.usedBy.findIndex((user) => user.userId.toString() === req.user.id.toString())

                if (usedUserIndex < 0) {
                    promo.usedBy.push({ count: 1, userId: req.user.id })
                } else {
                    promo.usedBy[usedUserIndex].count += 1
                    promo.usedBy[usedUserIndex].userId = req.user.id
                }
                promo.modifiedPaths()
                await promo.save()

            }
            cart.grandTotalQty = totalQty(cart.products)
            cart.grandTotalPrice = Number(getGrandTotal(cart.products))
        }

        // update userId to userID
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

        const statusmap: Record<string, string> = {
            'a': SalesStatus.ACTIVE,
            'p': SalesStatus.PENDING,
            'e': SalesStatus.EXPIRED
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