import * as z from 'zod';

// Define sub-schemas
const photoSchema = z.object({
  url: z.string(),
  secure_url: z.string(),
});

const reviewSchema = z.object({
  userId: z.string(),
  title: z.string().optional(),
  description: z.string().optional(),
  star: z.number().int().min(0).max(5),
  date: z.date().default(() => new Date()),
});

// Define the main Product schema
export const productSchema = z.object({
  name: z.string(),
  price: z.string(),
  currencyCode: z.string(), 
  description: z.string(),
  category: z.string(),
  brand: z.string(),
  sellerId: z.string().optional(),
  sizes: z.array(z.string()),
  color: z.string(),
  gender: z.string(),
  isDiscontinued: z.string(),
  keywords:z.array( z.string()).optional(),
  shopId:z.string(),
  stock:z.string()
});

export const productIdSchema = z.object({
  productId: z.string()
})


export const productQuerySchema = z.object({
  name: z.string().optional(),
  category: z.string().optional(),
  size: z.string().optional(),
  ratings: z.string().optional(),
  brand: z.string().optional(),
  color: z.string().optional(),
  isDiscontinued: z.string().optional(),
  description: z.string().optional(),
  price: z.string().optional(),
  sort: z.string().optional(),
  limit: z.string().optional(),
  page: z.string().optional(),
}).strict({message:'Please provide a valid query'});


export const productIdsSchema = z.object({
  productsIds:z.array(z.string())
}).strict({message:'Please provide a valid products ids'});


export type ProductSchemaType = z.infer<typeof productSchema >
export type ProductIdSchemaType = z.infer<typeof productIdSchema >
export type ProductQuerySchemaType = z.infer<typeof productQuerySchema >
export type ProductIdsSchemaType = z.infer<typeof productIdsSchema >