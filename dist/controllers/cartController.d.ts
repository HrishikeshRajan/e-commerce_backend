import { CartCore, CartItemCore, CartItemDocument } from "@models/cartModel";
import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import { FlashSaleDocument } from "@models/flashSale.model";
import { Promo } from "types/CouponManagement";
import { IUser } from "types/IUser.interfaces";
export declare const getGrandTotal: (products: Record<string, CartItemCore>) => string;
export type PromoArgsSuccess = {
    cartItem: CartItemDocument;
    couponIndex: number;
};
export declare function isNull<T>(response: T | null): response is null;
export declare function isPromoCodeAssignedToProduct(item: any, promo: Promo): boolean | undefined;
export declare function isCouponActivated(promo: Promo): boolean;
export declare function isCouponExpired(promo: Promo): boolean;
export declare function isCouponAtUsageLimit(promo: Promo): boolean;
export declare function isMinimumAmountPresentInCart(promo: Promo, usercart: CartCore): boolean;
export type Method = 'COUPON' | 'VOUCHER' | 'FLASHSALE' | 'CLEARENCE';
export type Percentage = {
    type: 'PERCENTAGE';
    method: Method;
    originalAmount: number;
    discountPercentage: number;
    discountedPrice: number;
    tax: number;
    discountedPriceAftTax: number;
    yourSavings: number;
    couponId: string;
    productId?: string;
    promoCode?: string;
};
export type Flat = {
    type: 'FLAT';
    method: Method;
    originalAmount: number;
    discountFixedAmount: number;
    discountedPrice: number;
    tax: number;
    discountedPriceAftTax: number;
    yourSavings: number;
    couponId: string;
    productId?: string;
    promoCode?: string;
};
/**
 * Generic helpers
 */
export type OfferParams = Promo | FlashSaleDocument;
export declare function isOfferActivated<T extends OfferParams>(promo: T): boolean;
export declare function isOfferExpired<T extends OfferParams>(promo: T): boolean;
/**
 *
 * Discount calculation API
 *
 *
 */
export declare function getFixedDiscountAmount(promo: OfferParams): number | undefined;
export declare function computeDiscountAmount(originalPrice: number, amountToDiscount: number): number;
export declare function computeTax(totalPriceBeforeTax: number, gstInPercentage: number): number;
export declare function getProductId(cartItem: CartItemCore): mongoose.Types.ObjectId;
export declare function getUserId(userStore: IUser): any;
export declare function computeAmountToDeduct(cartItem: CartItemCore, promo: OfferParams): number;
export declare function getDiscountPercentage(promo: OfferParams): number | null | undefined;
export declare function calculatePercentageDiscount(cartItem: CartItemCore, promo: OfferParams, gstInPercentage: number): Percentage | null;
export declare function calculateFlatDiscount(cartItem: CartItemCore, promo: OfferParams, gstInPercentage: number): Flat | null;
export declare function isPromoApplied(cartItem: CartItemCore): boolean;
export declare function isUserAlreadyAppliedThePromoCode(userStore: IUser | null, promo: Promo, productId: string): boolean;
export declare const add: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const addFlashCart: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const setFlashSaleStatus: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const updateQty: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const updateSize: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const get: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const getLatestCartByUserId: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const getCartAndUserIds: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const deleteCart: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const deleteProduct: (req: Request, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=cartController.d.ts.map