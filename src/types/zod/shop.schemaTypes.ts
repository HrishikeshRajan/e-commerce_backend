import { z } from "zod";

export const ShopsIds =  z.object({
    shopsIds: z.array(z.string())
}).strict({message:'Please provide valid shop ids'})

export type ShopsIds = z.infer<typeof ShopsIds>