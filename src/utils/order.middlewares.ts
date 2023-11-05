import { z } from 'zod';
import mongoose from 'mongoose';





export const VALIDATE_CART_USER_SCHEMA = z.object({
    cart_id: z.string().refine((id) => {
        if (mongoose.isValidObjectId(id)) {
            return true
        } else {
            return false;
        }
    }, { message: "Invalid product id" }),
    user_id: z.string().refine((id) => {
        if (mongoose.isValidObjectId(id)) {
            return true
        } else {
            return false;
        }
    }, { message: "Invalid user id" })
});
export const VALIDATE_ORDER_USER_SCHEMA = z.object({
    order_id: z.string().refine((id) => {
        if (mongoose.isValidObjectId(id)) {
            return true
        } else {
            return false;
        }
    }, { message: "Invalid product id" }),
    user_id: z.string().refine((id) => {
        if (mongoose.isValidObjectId(id)) {
            return true
        } else {
            return false;
        }
    }, { message: "Invalid user id" })
});
export const VALIDATE_ORDER_USER_STATUS_SCHEMA = z.object({
    order_id: z.string().refine((id) => {
        if (mongoose.isValidObjectId(id)) {
            return true
        } else {
            return false;
        }
    }, { message: "Invalid product id" }),
    user_id: z.string().refine((id) => {
        if (mongoose.isValidObjectId(id)) {
            return true
        } else {
            return false;
        }
    }, { message: "Invalid user id" }),
    status:z.string().nonempty(),
});


export type VALIDATE_CART_USER_SCHEMA = z.infer<typeof VALIDATE_CART_USER_SCHEMA>;
export type VALIDATE_ORDER_USER_SCHEMA = z.infer<typeof VALIDATE_ORDER_USER_SCHEMA>;
export type VALIDATE_ORDER_USER_STATUS_SCHEMA = z.infer<typeof VALIDATE_ORDER_USER_STATUS_SCHEMA>;
