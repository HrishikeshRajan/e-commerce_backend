"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProduct = exports.deleteCart = exports.getCartAndUserIds = exports.getLatestCartByUserId = exports.get = exports.updateSize = exports.updateQty = exports.setFlashSaleStatus = exports.addFlashCart = exports.add = exports.isUserAlreadyAppliedThePromoCode = exports.isPromoApplied = exports.calculateFlatDiscount = exports.calculatePercentageDiscount = exports.getDiscountPercentage = exports.computeAmountToDeduct = exports.getUserId = exports.getProductId = exports.computeTax = exports.computeDiscountAmount = exports.getFixedDiscountAmount = exports.isOfferExpired = exports.isOfferActivated = exports.isMinimumAmountPresentInCart = exports.isCouponAtUsageLimit = exports.isCouponExpired = exports.isCouponActivated = exports.isPromoCodeAssignedToProduct = exports.isNull = exports.getGrandTotal = void 0;
const cartModel_1 = __importStar(require("../models/cartModel"));
const CustomError_1 = __importDefault(require("../utils/CustomError"));
const productModel_1 = __importDefault(require("../models/productModel"));
const product_repository_1 = require("../repository/product.repository");
const response_services_1 = require("../services/response.services");
const currency_js_1 = __importDefault(require("currency.js"));
const http_status_codes_1 = require("http-status-codes");
const lodash_1 = require("lodash");
const mongoose_1 = __importDefault(require("mongoose"));
const price_util_1 = require("../utils/price.util");
const flashSale_model_1 = __importDefault(require("../models/flashSale.model"));
const tax_util_1 = require("../utils/tax.util");
const promoModel_1 = __importDefault(require("../models/promoModel"));
const Logger_1 = __importDefault(require("../utils/LoggerFactory/Logger"));
const findTotalPrice = async (productId, qty, productRepo) => {
    const product = await productRepo.findProductById(productId);
    return (0, currency_js_1.default)(product?.price).multiply(qty).value;
};
const updateGrandTotal = (products) => {
    const productsArray = Array.from(products);
    let total = 0;
    for (let [key, item] of productsArray) {
        total = (0, currency_js_1.default)(total).add(item.totalPriceAfterTax).value;
    }
    return total;
};
const calculateTotalQty = (products) => {
    const productsArray = Array.from(products);
    let total = 0;
    for (let item of productsArray) {
        total += item[1].qty;
    }
    return total;
};
/* Updated utils */
const getPricePerQuantity = async (productId, qty) => {
    return await productModel_1.default.aggregate([
        {
            $match: {
                _id: new mongoose_1.default.Types.ObjectId(productId) // Convert productId to ObjectId if it's a string
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
    ]);
};
const totalQty = (products) => {
    return Object.values(products).reduce((totalQty, item) => totalQty + item.qty, 0);
};
const getGrandTotal = (products) => {
    const productsArray = Object.values(products);
    let total = 0;
    for (const item of productsArray) {
        if (item.appliedOffer?.couponId) {
            total = (0, currency_js_1.default)(total).add(item.appliedOffer.discountedPriceAftTax).value;
        }
        else {
            total = (0, currency_js_1.default)(total).add(item.totalPriceAfterTax).value;
        }
    }
    return total.toFixed();
};
exports.getGrandTotal = getGrandTotal;
function isNull(response) {
    return response === null;
}
exports.isNull = isNull;
function isPromoCodeAssignedToProduct(item, promo) {
    return promo.tags.products && promo.tags.products.indexOf(item.productId) < 0;
}
exports.isPromoCodeAssignedToProduct = isPromoCodeAssignedToProduct;
function isCouponActivated(promo) {
    const currentDate = new Date();
    const startDate = new Date(promo.startTime);
    return (currentDate > startDate);
}
exports.isCouponActivated = isCouponActivated;
function isCouponExpired(promo) {
    const currentDate = new Date();
    const endDate = new Date(promo.endTime);
    return currentDate > endDate;
}
exports.isCouponExpired = isCouponExpired;
function isCouponAtUsageLimit(promo) {
    return (Number(promo.maxUsage) < 1);
}
exports.isCouponAtUsageLimit = isCouponAtUsageLimit;
function isMinimumAmountPresentInCart(promo, usercart) {
    return (usercart.grandTotalPrice > promo.minAmountInCart);
}
exports.isMinimumAmountPresentInCart = isMinimumAmountPresentInCart;
function isOfferActivated(promo) {
    const currentDate = new Date();
    const startDate = new Date(promo.startTime);
    return (currentDate > startDate);
}
exports.isOfferActivated = isOfferActivated;
function isOfferExpired(promo) {
    const currentDate = new Date();
    const endDate = new Date(promo.endTime);
    return currentDate > endDate;
}
exports.isOfferExpired = isOfferExpired;
/**
 *
 * Discount calculation API
 *
 *
 */
function getFixedDiscountAmount(promo) {
    if (promo.type === 'FLAT') {
        return promo.discountAmount;
    }
    return -1;
}
exports.getFixedDiscountAmount = getFixedDiscountAmount;
function computeDiscountAmount(originalPrice, amountToDiscount) {
    return Math.round((0, currency_js_1.default)(originalPrice).subtract(amountToDiscount).value);
}
exports.computeDiscountAmount = computeDiscountAmount;
function computeTax(totalPriceBeforeTax, gstInPercentage) {
    const tax = (0, currency_js_1.default)(totalPriceBeforeTax).multiply(gstInPercentage).divide(100);
    return Math.round(tax.value);
}
exports.computeTax = computeTax;
function getProductId(cartItem) {
    return cartItem.product;
}
exports.getProductId = getProductId;
function getUserId(userStore) {
    return userStore._id;
}
exports.getUserId = getUserId;
function computeAmountToDeduct(cartItem, promo) {
    const discountPercentage = promo.discountPercentage || 100;
    const amountToDeduct = (cartItem.totalPrice / 100) * discountPercentage;
    return amountToDeduct;
}
exports.computeAmountToDeduct = computeAmountToDeduct;
function getDiscountPercentage(promo) {
    if (promo.type === 'PERCENTAGE') {
        return promo.discountPercentage;
    }
    return null;
}
exports.getDiscountPercentage = getDiscountPercentage;
const isFlashsale = (offer) => {
    return offer.method === 'FLASHSALE';
};
function calculatePercentageDiscount(cartItem, promo, gstInPercentage) {
    if (promo.type === 'PERCENTAGE') {
        if (isFlashsale(promo)) {
            console.log(promo);
            const savings = computeAmountToDeduct(cartItem, promo);
            const promoObject = {
                type: promo.type,
                method: promo.method,
                originalAmount: cartItem.totalPrice,
                discountPercentage: getDiscountPercentage(promo) ?? 0,
                discountedPrice: computeDiscountAmount(cartItem.totalPrice, savings),
                tax: computeTax(computeDiscountAmount(cartItem.totalPrice, getFixedDiscountAmount(promo) ?? 0), gstInPercentage),
                discountedPriceAftTax: computeDiscountAmount(cartItem.totalPrice, savings) + computeTax(computeDiscountAmount(cartItem.totalPrice, savings), gstInPercentage),
                yourSavings: cartItem.totalPrice - computeDiscountAmount(cartItem.totalPrice, savings),
                couponId: promo._id,
            };
            return promoObject;
        }
        const savings = computeAmountToDeduct(cartItem, promo);
        const promoObject = {
            type: promo.type,
            method: promo.method,
            originalAmount: cartItem.totalPrice,
            discountPercentage: getDiscountPercentage(promo) ?? 0,
            discountedPrice: computeDiscountAmount(cartItem.totalPrice, savings),
            tax: computeTax(computeDiscountAmount(cartItem.totalPrice, getFixedDiscountAmount(promo) ?? 0), gstInPercentage),
            discountedPriceAftTax: computeDiscountAmount(cartItem.totalPrice, savings) + computeTax(computeDiscountAmount(cartItem.totalPrice, savings), gstInPercentage),
            yourSavings: cartItem.totalPrice - computeDiscountAmount(cartItem.totalPrice, savings),
            couponId: promo._id,
            promoCode: promo.code,
        };
        return promoObject;
    }
    return null;
}
exports.calculatePercentageDiscount = calculatePercentageDiscount;
function calculateFlatDiscount(cartItem, promo, gstInPercentage) {
    if (promo.type === 'FLAT') {
        if (isFlashsale(promo)) {
            const promoObject = {
                type: promo.type,
                method: promo.method,
                originalAmount: cartItem.totalPrice,
                discountFixedAmount: getFixedDiscountAmount(promo) ?? 0,
                discountedPrice: computeDiscountAmount(cartItem.totalPrice, getFixedDiscountAmount(promo) ?? 0),
                tax: computeTax(computeDiscountAmount(cartItem.totalPrice, getFixedDiscountAmount(promo) ?? 0), gstInPercentage),
                discountedPriceAftTax: computeDiscountAmount(cartItem.totalPrice, getFixedDiscountAmount(promo) ?? 0) + computeTax(computeDiscountAmount(cartItem.totalPrice, getFixedDiscountAmount(promo) ?? 0), gstInPercentage),
                yourSavings: getFixedDiscountAmount(promo) ?? 0,
                couponId: promo._id,
                productId: getProductId(cartItem).toString(),
            };
            return promoObject;
        }
        const promoObject = {
            type: promo.type,
            method: promo.method,
            originalAmount: cartItem.totalPrice,
            discountFixedAmount: getFixedDiscountAmount(promo) ?? 0,
            discountedPrice: computeDiscountAmount(cartItem.totalPrice, getFixedDiscountAmount(promo) ?? 0),
            tax: computeTax(computeDiscountAmount(cartItem.totalPrice, getFixedDiscountAmount(promo) ?? 0), gstInPercentage),
            discountedPriceAftTax: computeDiscountAmount(cartItem.totalPrice, getFixedDiscountAmount(promo) ?? 0) + computeTax(computeDiscountAmount(cartItem.totalPrice, getFixedDiscountAmount(promo) ?? 0), gstInPercentage),
            yourSavings: getFixedDiscountAmount(promo) ?? 0,
            couponId: promo._id,
            productId: getProductId(cartItem).toString(),
            promoCode: promo.code,
        };
        return promoObject;
    }
    return null;
}
exports.calculateFlatDiscount = calculateFlatDiscount;
function isPromoApplied(cartItem) {
    return cartItem.appliedOffer !== undefined;
}
exports.isPromoApplied = isPromoApplied;
function isUserAlreadyAppliedThePromoCode(userStore, promo, productId) {
    if (!userStore)
        return false;
    const userId = getUserId(userStore);
    const userIndex = promo.usedBy.findIndex((user) => user.userId === userId);
    const userData = promo.usedBy[userIndex];
    if (!userData)
        return false;
    const productIndex = userData.products.findIndex((id) => id === productId);
    return productIndex > -1;
}
exports.isUserAlreadyAppliedThePromoCode = isUserAlreadyAppliedThePromoCode;
const add = async (req, res, next) => {
    try {
        const cartItems = req.body;
        const cart = {
            userId: new mongoose_1.default.Types.ObjectId(req.user.id),
            products: {},
            grandTotalPrice: 0,
            grandTotalQty: 0
        };
        const gstInPercentage = 12;
        for (let item of cartItems) {
            const cartItem = item;
            const calculatePricePerQuantity = await getPricePerQuantity(cartItem.productId, cartItem.qty);
            const product = await productModel_1.default.findById(cartItem.productId).select({ stock: 1, name: 1 });
            if (!product) {
                next(new CustomError_1.default((0, http_status_codes_1.getReasonPhrase)(` Product: ${cartItem.productId} ${http_status_codes_1.StatusCodes.NOT_FOUND}`), http_status_codes_1.StatusCodes.NOT_FOUND, false));
                return;
            }
            if (product.stock < cartItem.qty) {
                return next(new CustomError_1.default(`${product.name} is OUT OF STOCK`, http_status_codes_1.StatusCodes.NOT_FOUND, false));
            }
            const totalPrice = Number(calculatePricePerQuantity[0].totalPrice);
            const price = new price_util_1.CartPrice(totalPrice);
            const orderItem = {
                product: cartItem.productId,
                qty: cartItem.qty,
                options: cartItem.options,
                orderStatus: cartModel_1.ORDER_STATUS.NOT_PROCESSED,
                totalPrice: price.getInitialPrice(),
                gstInPercentage,
                taxAmount: price.getTaxAmount(),
                totalPriceBeforeTax: price.getInitialPrice(),
                totalPriceAfterTax: price.getMRP(),
            };
            cart.products[item.productId] = orderItem;
            product.stock -= Number(cartItem.qty);
            product.modifiedPaths();
            await product.save();
        }
        cart.grandTotalQty = totalQty(cart.products);
        cart.grandTotalPrice = Number((0, exports.getGrandTotal)(cart.products));
        Logger_1.default.info('Entering to offer applying loop');
        const uniqProducts = new Set();
        for (let item of cartItems) {
            Logger_1.default.info('Checking promo code exists');
            if (item.promoCode) {
                Logger_1.default.info('Searching promocode exits in database');
                const promo = await promoModel_1.default.findOne({ code: item.promoCode });
                // logger.info(promo)
                Logger_1.default.info('Checking promo is null or not');
                if (isNull(promo)) {
                    return next(new CustomError_1.default('This coupon is not applicable', http_status_codes_1.StatusCodes.NOT_FOUND, false));
                }
                Logger_1.default.info('Checking is promo code is assigned to corresponding product');
                if (isPromoCodeAssignedToProduct(item, promo)) {
                    return next(new CustomError_1.default('This coupon is not applicable to any product', http_status_codes_1.StatusCodes.NOT_FOUND, false));
                }
                Logger_1.default.info('Checking promocode is activated');
                if (!isCouponActivated(promo)) {
                    return next(new CustomError_1.default('Promo code is not activated ', http_status_codes_1.StatusCodes.NOT_FOUND, false));
                }
                Logger_1.default.info('Checking promo code is expired');
                if (isCouponExpired(promo)) {
                    return next(new CustomError_1.default('Promo Code is expired ', http_status_codes_1.StatusCodes.NOT_FOUND, false));
                }
                Logger_1.default.info('Checking promo code reaches usgae limit');
                if (isCouponAtUsageLimit(promo)) {
                    return next(new CustomError_1.default('Global coupon limit exceed', http_status_codes_1.StatusCodes.NOT_FOUND, false));
                }
                Logger_1.default.info('Checking minimum amount present in cart');
                if (!isMinimumAmountPresentInCart(promo, cart)) {
                    return next(new CustomError_1.default(`Unable to apply. Cart Should contain minimum ${promo.minAmountInCart}}`, http_status_codes_1.StatusCodes.NOT_FOUND, false));
                }
                Logger_1.default.info('Checking user already applied coupon to same product');
                //user already used
                const hasCouponBeenRedeemed = promo.usedBy.find(user => user.userId.toString() === req.user.id.toString());
                if (hasCouponBeenRedeemed && (hasCouponBeenRedeemed.count > promo.maxUsagePerUser)) {
                    return next(new CustomError_1.default('Your coupon reached maximum', http_status_codes_1.StatusCodes.BAD_REQUEST, false));
                }
                Logger_1.default.info('starting applying discount');
                //Now rework the offer apply
                let cartItem = cart.products[item.productId];
                if (promo.type === 'FLAT') {
                    const promoObject = calculateFlatDiscount(cartItem, promo, gstInPercentage);
                    if (!isPromoApplied(cartItem)) {
                        if (promoObject) {
                            cartItem.appliedOffer = promoObject;
                        }
                    }
                }
                Logger_1.default.info('Applying flat discount');
                if (promo.type === 'PERCENTAGE') {
                    const promoObject = calculatePercentageDiscount(cartItem, promo, gstInPercentage);
                    if (!isPromoApplied(cartItem)) {
                        if (promoObject) {
                            cartItem.appliedOffer = promoObject;
                        }
                    }
                }
                cart.products[item.productId] = cartItem;
                let usedUserIndex = promo.usedBy.findIndex((user) => user.userId.toString() === req.user.id.toString());
                if (usedUserIndex < 0) {
                    promo.usedBy.push({ count: 1, userId: req.user.id, products: [item.producId] });
                }
                else {
                    let productIndex = -1;
                    promo.usedBy.forEach((users) => {
                        productIndex = users.products.findIndex((id) => id === item.productId);
                    });
                    if (productIndex < 0) {
                        promo.usedBy[usedUserIndex].count += 1;
                        promo.usedBy[usedUserIndex].userId = req.user.id;
                        promo.usedBy[usedUserIndex].products.push(item.productId);
                    }
                }
                promo.modifiedPaths();
                await promo.save();
            }
            if (item.saleId) {
                const flashsale = await flashSale_model_1.default.findById(item.saleId);
                if (isNull(flashsale)) {
                    return next(new CustomError_1.default('This coupon is not applicable', http_status_codes_1.StatusCodes.NOT_FOUND, false));
                }
                if (!isOfferActivated(flashsale)) {
                    return next(new CustomError_1.default('Flashsale is not active ', http_status_codes_1.StatusCodes.NOT_FOUND, false));
                }
                if (isOfferExpired(flashsale)) {
                    return next(new CustomError_1.default('Promo Code is expired ', http_status_codes_1.StatusCodes.NOT_FOUND, false));
                }
                //user already used
                const hasCouponBeenRedeemed = flashsale.users.usedBy.find(userId => userId.toString() === req.user.id.toString());
                if (hasCouponBeenRedeemed) {
                    return next(new CustomError_1.default('You\'ve already made the purchase.', http_status_codes_1.StatusCodes.NOT_FOUND, false));
                }
                //Now rework the offer apply
                let cartItem = cart.products[item.productId];
                if (flashsale.type === 'FLAT') {
                    const promoObject = calculateFlatDiscount(cartItem, flashsale, gstInPercentage);
                    if (!isPromoApplied(cartItem)) {
                        if (promoObject) {
                            cartItem.appliedOffer = promoObject;
                        }
                    }
                }
                if (flashsale.type === 'PERCENTAGE') {
                    const promoObject = calculatePercentageDiscount(cartItem, flashsale, gstInPercentage);
                    if (!isPromoApplied(cartItem)) {
                        if (promoObject) {
                            cartItem.appliedOffer = promoObject;
                        }
                    }
                }
                cart.products[item.productId] = cartItem;
                let usedUserIndex = flashsale.users.usedBy.findIndex((userId) => userId.toString() === req.user.id.toString());
                if (usedUserIndex < 0) {
                    flashsale.users.usedBy.push(req.user.id);
                }
                flashsale.modifiedPaths();
                await flashsale.save();
            }
            cart.grandTotalQty = totalQty(cart.products);
            cart.grandTotalPrice = Number((0, exports.getGrandTotal)(cart.products));
        }
        // update userId to userID
        const mycart = (await (await cartModel_1.default.create(cart)).populate('products.$*.product')).toObject({ flattenMaps: true });
        const cartId = mycart._id;
        delete mycart._id;
        delete mycart.__v;
        delete mycart.createdAt;
        (0, lodash_1.merge)(mycart, { cartId });
        // console.log('k')
        (0, response_services_1.sendHTTPResponse)({ res, message: { ids: { cartId: cartId, userId: req.user.id } }, statusCode: http_status_codes_1.StatusCodes.CREATED, success: true });
    }
    catch (error) {
        const errorObj = error;
        next(new CustomError_1.default(errorObj.message, errorObj.code, false));
    }
};
exports.add = add;
const addFlashCart = async (req, res, next) => {
    try {
        const cartItems = req.body;
        const cart = {
            userId: new mongoose_1.default.Types.ObjectId(req.user.id),
            products: {},
            grandTotalPrice: 0,
            grandTotalQty: 0
        };
        const gstInPercentage = 12;
        for (let item of cartItems) {
            const cartItem = item;
            const calculatePricePerQuantity = await getPricePerQuantity(cartItem.productId, cartItem.qty);
            const product = await productModel_1.default.findById(cartItem.productId).select({ stock: 1, name: 1 });
            if (!product) {
                next(new CustomError_1.default((0, http_status_codes_1.getReasonPhrase)(http_status_codes_1.StatusCodes.NOT_FOUND), http_status_codes_1.StatusCodes.NOT_FOUND, false));
                return;
            }
            const flashsale = await flashSale_model_1.default.findOne({ 'product': cartItem.productId });
            if (!flashsale) {
                return next(new CustomError_1.default(`${product.name} is not available`, http_status_codes_1.StatusCodes.NOT_FOUND, false));
            }
            if (new Date() < new Date(flashsale.startTime)) {
                return next(new CustomError_1.default(`${product.name} flash sale not started`, http_status_codes_1.StatusCodes.NOT_FOUND, false));
            }
            if (flashsale?.currentStock < cartItem.qty) {
                return next(new CustomError_1.default(`${product.name} is OUT OF STOCK`, http_status_codes_1.StatusCodes.NOT_FOUND, false));
            }
            if (flashsale.users?.usedBy.includes(req.user.id)) {
                return next(new CustomError_1.default(`You cannot purchase again`, http_status_codes_1.StatusCodes.NOT_FOUND, false));
            }
            if (new Date() > new Date(flashsale.endTime)) {
                return next(new CustomError_1.default(`${product.name} flash sale ended`, http_status_codes_1.StatusCodes.NOT_FOUND, false));
            }
            const totalPrice = Number(calculatePricePerQuantity[0].totalPrice);
            const price = new price_util_1.CartPrice(totalPrice);
            const orderItem = {
                product: cartItem.productId,
                qty: 1,
                options: cartItem.options,
                orderStatus: cartModel_1.ORDER_STATUS.NOT_PROCESSED,
                totalPrice: flashsale.priceAfterDiscount,
                gstInPercentage,
                taxAmount: (0, tax_util_1.getTax)(flashsale.priceAfterDiscount),
                totalPriceBeforeTax: flashsale.priceAfterDiscount,
                totalPriceAfterTax: Math.floor(flashsale.priceAfterDiscount + (0, tax_util_1.getTax)(flashsale.priceAfterDiscount)),
            };
            cart.products[item.productId] = orderItem;
            product.modifiedPaths();
            await product.save();
            flashsale.currentStock -= 1;
            flashsale.users?.usedBy.push(req.user.id);
            flashsale.modifiedPaths();
            await flashsale.save();
        }
        cart.grandTotalQty = totalQty(cart.products);
        cart.grandTotalPrice = Number((0, exports.getGrandTotal)(cart.products));
        const mycart = (await (await cartModel_1.default.create(cart)).populate('products.$*.product')).toObject({ flattenMaps: true });
        const cartId = mycart._id;
        delete mycart._id;
        delete mycart.__v;
        delete mycart.createdAt;
        (0, lodash_1.merge)(mycart, { cartId });
        (0, response_services_1.sendHTTPResponse)({ res, message: { mycart }, statusCode: http_status_codes_1.StatusCodes.CREATED, success: true });
    }
    catch (error) {
        const errorObj = error;
        next(new CustomError_1.default(errorObj.message, errorObj.code, false));
    }
};
exports.addFlashCart = addFlashCart;
const setFlashSaleStatus = async (req, res, next) => {
    try {
        const statusmap = {
            'a': "ACTIVE" /* SalesStatus.ACTIVE */,
            'p': "PENDING" /* SalesStatus.PENDING */,
            'e': "EXPIRED" /* SalesStatus.EXPIRED */
        };
        const cartItems = req.body;
        const flashsale = await flashSale_model_1.default.findById(req.params.flashsaleId);
        if (!flashsale) {
            return next(new CustomError_1.default(`Sale is not available`, http_status_codes_1.StatusCodes.NOT_FOUND, false));
        }
        flashsale.status = statusmap[req.body.status.toLowerCase()];
        flashsale.modifiedPaths();
        await flashsale?.save();
        (0, response_services_1.sendHTTPResponse)({ res, message: { flashsale }, statusCode: http_status_codes_1.StatusCodes.CREATED, success: true });
    }
    catch (error) {
        const errorObj = error;
        next(new CustomError_1.default(errorObj.message, errorObj.code, false));
    }
};
exports.setFlashSaleStatus = setFlashSaleStatus;
const updateQty = async (req, res, next) => {
    try {
        const productRepo = new product_repository_1.ProductRepo(productModel_1.default);
        const myCart = await cartModel_1.default.findById(req.params.cartId).select('-__v -createdAt -updatedAt');
        if (!myCart) {
            next(new CustomError_1.default((0, http_status_codes_1.getReasonPhrase)(http_status_codes_1.StatusCodes.NOT_FOUND), http_status_codes_1.StatusCodes.NOT_FOUND, false));
            return;
        }
        const product = myCart.products.get(req.params.productId);
        if (!product) {
            next(new CustomError_1.default((0, http_status_codes_1.getReasonPhrase)(http_status_codes_1.StatusCodes.NOT_FOUND), http_status_codes_1.StatusCodes.NOT_FOUND, false));
            return;
        }
        product.qty = req.body.qty;
        const totalPrice = await findTotalPrice(req.params.productId, req.body.qty, productRepo);
        product.totalPrice = totalPrice;
        product.taxAmount = (0, currency_js_1.default)(product.totalPrice).multiply(product.gstInPercentage).divide(100).value;
        product.totalPriceBeforeTax = totalPrice;
        product.totalPriceAfterTax = Math.round(totalPrice + product.taxAmount);
        let rupee = new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
        });
        (0, lodash_1.merge)(product, { totalPriceAfterTaxString: rupee.format(Math.round(totalPrice + product.taxAmount)) });
        myCart.products.set(req.params.productId, product);
        myCart.grandTotalPrice = updateGrandTotal(myCart.products);
        myCart.grandTotalQty = calculateTotalQty(myCart.products);
        // myCart.grandTotalPriceString = rupee.format(myCart.grandTotalPrice)
        myCart.modifiedPaths();
        const userCart = (await (await myCart.save()).populate('products.$*.productId')).toObject({ flattenMaps: true });
        const cartId = userCart._id;
        delete userCart._id;
        delete userCart.__v;
        delete userCart.updatedAt;
        (0, lodash_1.merge)(userCart, { cartId });
        (0, lodash_1.merge)(userCart, { grandTotalPriceString: rupee.format(myCart.grandTotalPrice) });
        (0, response_services_1.sendHTTPResponse)({ res, message: { cart: userCart }, statusCode: 200, success: true });
    }
    catch (error) {
        const errorObj = error;
        next(new CustomError_1.default(errorObj.message, errorObj.code, false));
    }
};
exports.updateQty = updateQty;
const updateSize = async (req, res, next) => {
    try {
        const myCart = await cartModel_1.default.findById(req.params.cartId).select('-__v -createdAt -updatedAt');
        if (!myCart) {
            next(new CustomError_1.default((0, http_status_codes_1.getReasonPhrase)(http_status_codes_1.StatusCodes.NOT_FOUND), http_status_codes_1.StatusCodes.NOT_FOUND, false));
            return;
        }
        const product = myCart.products.get(req.params.productId);
        if (!product) {
            next(new CustomError_1.default((0, http_status_codes_1.getReasonPhrase)(http_status_codes_1.StatusCodes.NOT_FOUND), http_status_codes_1.StatusCodes.NOT_FOUND, false));
            return;
        }
        product.options.size = req.body.size;
        let rupee = new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
        });
        (0, lodash_1.merge)(product, { totalPriceAfterTaxString: rupee.format(Math.round(product.totalPrice + product.taxAmount)) });
        myCart.products.set(req.params.productId, product);
        myCart.modifiedPaths();
        const userCart = (await (await myCart.save()).populate('products.$*.productId')).toObject({ flattenMaps: true });
        const cartId = userCart._id;
        delete userCart._id;
        delete userCart.__v;
        delete userCart.updatedAt;
        (0, lodash_1.merge)(userCart, { cartId });
        (0, response_services_1.sendHTTPResponse)({ res, message: { cart: userCart }, statusCode: 200, success: true });
    }
    catch (error) {
        const errorObj = error;
        next(new CustomError_1.default(errorObj.message, errorObj.code, false));
    }
};
exports.updateSize = updateSize;
const get = async (req, res, next) => {
    try {
        const myCart = await cartModel_1.default.findOne({ userId: req.user.id }).select('-__v -createdAt').populate({
            path: 'products.$*.product'
        }).lean();
        if (!myCart) {
            next(new CustomError_1.default((0, http_status_codes_1.getReasonPhrase)(http_status_codes_1.StatusCodes.NOT_FOUND), http_status_codes_1.StatusCodes.NOT_FOUND, false));
            return;
        }
        const cartId = myCart._id;
        delete myCart._id;
        (0, lodash_1.merge)(myCart, { cartId });
        (0, response_services_1.sendHTTPResponse)({ res, message: { cart: myCart }, statusCode: 200, success: true });
    }
    catch (error) {
        const errorObj = error;
        next(new CustomError_1.default(errorObj.message, errorObj.code, false));
    }
};
exports.get = get;
const getLatestCartByUserId = async (req, res, next) => {
    try {
        const cart = await cartModel_1.default.findOne({ userId: req.user.id, status: cartModel_1.CART_STATUS.ACTIVE }).sort({ _id: -1 }).select('-__v -createdAt').populate({
            path: 'products.$*.product'
        }).lean();
        if (!cart) {
            next(new CustomError_1.default((0, http_status_codes_1.getReasonPhrase)(http_status_codes_1.StatusCodes.NOT_FOUND), http_status_codes_1.StatusCodes.OK, true));
            return;
        }
        const cartId = cart._id;
        delete cart._id;
        (0, lodash_1.merge)(cart, { cartId });
        (0, response_services_1.sendHTTPResponse)({ res, message: { cart }, statusCode: 200, success: true });
    }
    catch (error) {
        const errorObj = error;
        next(new CustomError_1.default(errorObj.message, errorObj.code, false));
    }
};
exports.getLatestCartByUserId = getLatestCartByUserId;
const getCartAndUserIds = async (req, res, next) => {
    try {
        const myCart = await cartModel_1.default.findOne({ userId: req.user.id });
        if (!myCart) {
            next(new CustomError_1.default((0, http_status_codes_1.getReasonPhrase)(http_status_codes_1.StatusCodes.NOT_FOUND), http_status_codes_1.StatusCodes.NOT_FOUND, false));
            return;
        }
        (0, response_services_1.sendHTTPResponse)({ res, message: { cart: { cartId: myCart._id, userId: req.user.id } }, statusCode: 200, success: true });
    }
    catch (error) {
        const errorObj = error;
        next(new CustomError_1.default(errorObj.message, errorObj.code, false));
    }
};
exports.getCartAndUserIds = getCartAndUserIds;
const deleteCart = async (req, res, next) => {
    try {
        const isDeleted = await cartModel_1.default.findByIdAndDelete(req.params.cartId);
        if (!isDeleted) {
            next(new CustomError_1.default((0, http_status_codes_1.getReasonPhrase)(http_status_codes_1.StatusCodes.NOT_FOUND), http_status_codes_1.StatusCodes.NOT_FOUND, false));
            return;
        }
        (0, response_services_1.sendHTTPResponse)({ res, message: { cart: isDeleted }, statusCode: 200, success: true });
    }
    catch (error) {
        const errorObj = error;
        next(new CustomError_1.default(errorObj.message, errorObj.code, false));
    }
};
exports.deleteCart = deleteCart;
const deleteProduct = async (req, res, next) => {
    try {
        const myCart = await cartModel_1.default.findById(req.params.cartId);
        let rupee = new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
        });
        if (!myCart) {
            next(new CustomError_1.default((0, http_status_codes_1.getReasonPhrase)(http_status_codes_1.StatusCodes.NOT_FOUND), http_status_codes_1.StatusCodes.NOT_FOUND, false));
            return;
        }
        if (!myCart.products.get(req.params.productId)) {
            {
                next(new CustomError_1.default(`Product ${(0, http_status_codes_1.getReasonPhrase)(http_status_codes_1.StatusCodes.NOT_FOUND)}`, http_status_codes_1.StatusCodes.NOT_FOUND, false));
                return;
            }
        }
        myCart.products.delete(req.params.productId);
        myCart.grandTotalPrice = updateGrandTotal(myCart.products);
        myCart.grandTotalQty = calculateTotalQty(myCart.products);
        if (myCart.products.size === 0) {
            await cartModel_1.default.findByIdAndDelete(req.params.cartId);
            return (0, response_services_1.sendHTTPResponse)({ res, message: { cart: null }, statusCode: 200, success: true });
        }
        myCart.modifiedPaths();
        const userCart = (await (await myCart.save()).populate('products.$*.product')).toObject({ flattenMaps: true });
        const cartId = userCart._id;
        delete userCart._id;
        delete userCart.__v;
        delete userCart.updatedAt;
        (0, lodash_1.merge)(userCart, { cartId });
        (0, response_services_1.sendHTTPResponse)({ res, message: { cart: userCart }, statusCode: 200, success: true });
    }
    catch (error) {
        const errorObj = error;
        next(new CustomError_1.default(errorObj.message, errorObj.code, false));
    }
};
exports.deleteProduct = deleteProduct;
//# sourceMappingURL=cartController.js.map