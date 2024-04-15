import { z } from 'zod';
export declare const ADD_TO_CART_SCHEMA: z.ZodObject<{
    productId: z.ZodEffects<z.ZodString, string, string>;
    userId: z.ZodEffects<z.ZodString, string, string>;
    qty: z.ZodNumber;
    price: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    userId: string;
    price: number;
    productId: string;
    qty: number;
}, {
    userId: string;
    price: number;
    productId: string;
    qty: number;
}>;
export declare const CART_QTY_SCHEMA: z.ZodObject<{
    qty: z.ZodNumber;
    userId: z.ZodEffects<z.ZodString, string, string>;
    productId: z.ZodEffects<z.ZodString, string, string>;
}, "strip", z.ZodTypeAny, {
    userId: string;
    productId: string;
    qty: number;
}, {
    userId: string;
    productId: string;
    qty: number;
}>;
export declare const PARAMS_WITH_ID_SCHEMA: z.ZodObject<{
    id: z.ZodEffects<z.ZodString, string, string>;
}, "strip", z.ZodTypeAny, {
    id: string;
}, {
    id: string;
}>;
export type CART_QTY = z.infer<typeof CART_QTY_SCHEMA>;
export type CART_INPUT = z.infer<typeof ADD_TO_CART_SCHEMA>;
export type PARAMS_WITH_ID = z.infer<typeof PARAMS_WITH_ID_SCHEMA>;
//# sourceMappingURL=cart.schemaTypes.d.ts.map