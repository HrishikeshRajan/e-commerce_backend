import { z } from "zod";
export declare const ShopsIds: z.ZodObject<{
    shopsIds: z.ZodArray<z.ZodString, "many">;
}, "strict", z.ZodTypeAny, {
    shopsIds: string[];
}, {
    shopsIds: string[];
}>;
export type ShopsIds = z.infer<typeof ShopsIds>;
//# sourceMappingURL=shop.schemaTypes.d.ts.map