import { z } from 'zod';
export declare const ReviewZodSchema: z.ZodObject<{
    userId: z.ZodString;
    productId: z.ZodString;
    title: z.ZodString;
    description: z.ZodString;
    star: z.ZodNumber;
    createdAt: z.ZodOptional<z.ZodDate>;
    updatedAt: z.ZodOptional<z.ZodDate>;
}, "strip", z.ZodTypeAny, {
    description: string;
    userId: string;
    title: string;
    star: number;
    productId: string;
    createdAt?: Date | undefined;
    updatedAt?: Date | undefined;
}, {
    description: string;
    userId: string;
    title: string;
    star: number;
    productId: string;
    createdAt?: Date | undefined;
    updatedAt?: Date | undefined;
}>;
export declare const ReviewUpdateZodSchema: z.ZodObject<Omit<{
    userId: z.ZodString;
    productId: z.ZodString;
    title: z.ZodString;
    description: z.ZodString;
    star: z.ZodNumber;
    createdAt: z.ZodOptional<z.ZodDate>;
    updatedAt: z.ZodOptional<z.ZodDate>;
}, "userId">, "strip", z.ZodTypeAny, {
    description: string;
    title: string;
    star: number;
    productId: string;
    updatedAt?: Date | undefined;
    createdAt?: Date | undefined;
}, {
    description: string;
    title: string;
    star: number;
    productId: string;
    updatedAt?: Date | undefined;
    createdAt?: Date | undefined;
}>;
export declare const ReviewIdZodSchema: z.ZodObject<{
    reviewId: z.ZodEffects<z.ZodString, string, string>;
}, "strip", z.ZodTypeAny, {
    reviewId: string;
}, {
    reviewId: string;
}>;
export declare const ReviewDeleteZodSchema: z.ZodObject<{
    productId: z.ZodEffects<z.ZodString, string, string>;
    reviewId: z.ZodEffects<z.ZodString, string, string>;
}, "strip", z.ZodTypeAny, {
    productId: string;
    reviewId: string;
}, {
    productId: string;
    reviewId: string;
}>;
export declare const ReviewListByQueryZodSchema: z.ZodObject<{
    pId: z.ZodEffects<z.ZodString, string, string>;
    page: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    pId: string;
    page?: string | undefined;
}, {
    pId: string;
    page?: string | undefined;
}>;
export type Review = z.infer<typeof ReviewZodSchema>;
export type ReviewId = z.infer<typeof ReviewIdZodSchema>;
export type ReviewListByQuery = z.infer<typeof ReviewListByQueryZodSchema>;
export type ReviewDeleteParams = z.infer<typeof ReviewDeleteZodSchema>;
//# sourceMappingURL=review.schema.zod.d.ts.map