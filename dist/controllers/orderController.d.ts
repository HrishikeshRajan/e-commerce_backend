import { type Request, type Response, type NextFunction } from 'express';
import { type IResponse } from '../types/IResponse.interfaces';
/**
 * Create a new order
 * @param {Request} req - HTTP request object
 * @param {Response} res - HTTP response object
 * @param {NextFunction} next - HTTP callback
 * @returns {Promise<void>}
 * @throws {CustomError} -  The error will send as response to client
 */
export declare const create: (req: Request, res: Response<IResponse>, next: NextFunction) => Promise<void>;
/**
   * Sets shipping address
   *
   * @param {Request} req - HTTP request object
   * @param {Response} res - HTTP response object
   * @param {NextFunction} next - HTTP callback
   * @returns {Promise<void>}
   */
export declare const addShippingAddress: (req: Request, res: Response<IResponse>, next: NextFunction) => Promise<void>;
export declare const getSingleOrder: (req: Request, res: Response<IResponse>, next: NextFunction) => Promise<void>;
/**
   * Payment method select controller
   *
   * @param {Request} req - HTTP request object
   * @param {Response} res - HTTP response object
   * @param {NextFunction} next - HTTP callback
   * @returns {Promise<void>}
   */
export declare const paymentIntent: (req: Request, res: Response<IResponse>, next: NextFunction) => Promise<void>;
export declare const StripeWebHook: (req: Request, res: Response<IResponse>, next: NextFunction) => Promise<any>;
/**
   * Payment method select controller
   *
   * @param {Request} req - HTTP request object
   * @param {Response} res - HTTP response object
   * @param {NextFunction} next - HTTP callback
   * @returns {Promise<void>}
   */
export interface CartItem {
    productId: string;
    qty: number;
    totalPrice: number;
    options: {
        size: string;
        color: string;
    };
}
export interface Order {
    userId: string;
    cart: {
        cartId: string;
        products: {
            [x: string]: any;
        };
        grandTotalPrice: number;
        grandTotalQty: number;
    };
    shippingAddress: any;
    paymentDetails: any;
    orderDetails: any;
    orderedAt: string;
    orderId: string;
}
/**
   * List  orders
   *
   * @param {Request} req - HTTP request object
   * @param {Response} res - HTTP response object
   * @param {NextFunction} next - HTTP callback
   * @returns {Promise<void>}
   */
export declare const List: (req: Request, res: Response<IResponse>, next: NextFunction) => Promise<void>;
export declare const myPurchases: (req: Request, res: Response<IResponse>, next: NextFunction) => Promise<void>;
/**
   * Cancel Order Controller
   *
   * @param {Request<{},JResponse, ADDRESS_VALIDATE_SCHEMA,{}>} req - HTTP request object
   * @param {Response<JResponse>} res - HTTP response object
   * @param {NextFunction} next - HTTP callback
   * @returns {Promise<void>} - A promise that resolves when the request is complete.
   */
export declare const cancelOrder: (req: Request, res: Response, next: NextFunction) => Promise<void>;
/**
   * List  orders by shop
   *
   * @param {Request} req - HTTP request object
   * @param {Response} res - HTTP response object
   * @param {NextFunction} next - HTTP callback
   * @returns {Promise<void>}
   */
export declare const ListByShop: (req: Request, res: Response<IResponse>, next: NextFunction) => Promise<void>;
export declare const updateOrderStatus: (req: Request, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=orderController.d.ts.map