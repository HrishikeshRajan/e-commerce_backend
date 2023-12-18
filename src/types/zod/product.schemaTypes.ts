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
  image: z.string(),
  images: z.array(photoSchema).optional(),
  category: z.string(),
  brand: z.string(),
  sellerId: z.string().optional(),
  sizes: z.string(),
  color: z.string(),
  gender: z.string(),
  isDiscontinued: z.string(),
  keywords: z.array(z.string()).optional(),
});



export type ProductSchemaType = z.infer<typeof productSchema >