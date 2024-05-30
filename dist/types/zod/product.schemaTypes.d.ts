import * as z from 'zod';
export declare const productSchema: z.ZodObject<{
    name: z.ZodString;
    price: z.ZodString;
    currencyCode: z.ZodString;
    description: z.ZodString;
    category: z.ZodString;
    brand: z.ZodString;
    sellerId: z.ZodOptional<z.ZodString>;
    sizes: z.ZodArray<z.ZodString, "many">;
    color: z.ZodString;
    gender: z.ZodString;
    isDiscontinued: z.ZodString;
    keywords: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    shopId: z.ZodString;
    stock: z.ZodString;
}, "strip", z.ZodTypeAny, {
    name: string;
    description: string;
    brand: string;
    price: string;
    currencyCode: string;
    category: string;
    shopId: string;
    sizes: string[];
    color: string;
    gender: string;
    isDiscontinued: string;
    stock: string;
    sellerId?: string | undefined;
    keywords?: string[] | undefined;
}, {
    name: string;
    description: string;
    brand: string;
    price: string;
    currencyCode: string;
    category: string;
    shopId: string;
    sizes: string[];
    color: string;
    gender: string;
    isDiscontinued: string;
    stock: string;
    sellerId?: string | undefined;
    keywords?: string[] | undefined;
}>;
export declare const productIdSchema: z.ZodObject<{
    productId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    productId: string;
}, {
    productId: string;
}>;
export declare const productQuerySchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    category: z.ZodOptional<z.ZodString>;
    size: z.ZodOptional<z.ZodString>;
    ratings: z.ZodOptional<z.ZodString>;
    brand: z.ZodOptional<z.ZodString>;
    color: z.ZodOptional<z.ZodString>;
    isDiscontinued: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    price: z.ZodOptional<z.ZodString>;
    sort: z.ZodOptional<z.ZodString>;
    limit: z.ZodOptional<z.ZodString>;
    page: z.ZodOptional<z.ZodString>;
}, "strict", z.ZodTypeAny, {
    name?: string | undefined;
    category?: string | undefined;
    size?: string | undefined;
    ratings?: string | undefined;
    brand?: string | undefined;
    color?: string | undefined;
    isDiscontinued?: string | undefined;
    description?: string | undefined;
    price?: string | undefined;
    sort?: string | undefined;
    limit?: string | undefined;
    page?: string | undefined;
}, {
    name?: string | undefined;
    category?: string | undefined;
    size?: string | undefined;
    ratings?: string | undefined;
    brand?: string | undefined;
    color?: string | undefined;
    isDiscontinued?: string | undefined;
    description?: string | undefined;
    price?: string | undefined;
    sort?: string | undefined;
    limit?: string | undefined;
    page?: string | undefined;
}>;
export declare const productIdsSchema: z.ZodObject<{
    productsIds: z.ZodArray<z.ZodString, "many">;
}, "strict", z.ZodTypeAny, {
    productsIds: string[];
}, {
    productsIds: string[];
}>;
export type ProductSchemaType = z.infer<typeof productSchema>;
export type ProductIdSchemaType = z.infer<typeof productIdSchema>;
export type ProductQuerySchemaType = z.infer<typeof productQuerySchema>;
export type ProductIdsSchemaType = z.infer<typeof productIdsSchema>;
//# sourceMappingURL=product.schemaTypes.d.ts.map