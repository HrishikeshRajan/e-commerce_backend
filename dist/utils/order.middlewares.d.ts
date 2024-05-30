import { z } from 'zod';
export declare const VALIDATE_CART_USER_SCHEMA: z.ZodObject<{
    cart_id: z.ZodEffects<z.ZodString, string, string>;
    user_id: z.ZodEffects<z.ZodString, string, string>;
}, "strip", z.ZodTypeAny, {
    user_id: string;
    cart_id: string;
}, {
    user_id: string;
    cart_id: string;
}>;
export declare const VALIDATE_ORDER_USER_SCHEMA: z.ZodObject<{
    order_id: z.ZodEffects<z.ZodString, string, string>;
    user_id: z.ZodEffects<z.ZodString, string, string>;
}, "strip", z.ZodTypeAny, {
    user_id: string;
    order_id: string;
}, {
    user_id: string;
    order_id: string;
}>;
export declare const VALIDATE_ORDER_USER_STATUS_SCHEMA: z.ZodObject<{
    order_id: z.ZodEffects<z.ZodString, string, string>;
    user_id: z.ZodEffects<z.ZodString, string, string>;
    status: z.ZodString;
}, "strip", z.ZodTypeAny, {
    user_id: string;
    status: string;
    order_id: string;
}, {
    user_id: string;
    status: string;
    order_id: string;
}>;
export type VALIDATE_CART_USER_SCHEMA = z.infer<typeof VALIDATE_CART_USER_SCHEMA>;
export type VALIDATE_ORDER_USER_SCHEMA = z.infer<typeof VALIDATE_ORDER_USER_SCHEMA>;
export type VALIDATE_ORDER_USER_STATUS_SCHEMA = z.infer<typeof VALIDATE_ORDER_USER_STATUS_SCHEMA>;
//# sourceMappingURL=order.middlewares.d.ts.map