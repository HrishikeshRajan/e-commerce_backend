import mongoose from 'mongoose';
import { z } from 'zod';

export const ReviewZodSchema = z.object({
    userId: z.string(),
    productId: z.string(),
    title: z.string(),
    description: z.string(),
    star: z.number().int().min(0).max(5),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional()
});
export const ReviewUpdateZodSchema = ReviewZodSchema.omit({ userId: true });
export const ReviewIdZodSchema = z.object({
    reviewId: z.string().refine((id) => mongoose.Types.ObjectId.isValid(id), {
        message: 'Please select a review'
    })
});
export const ReviewDeleteZodSchema = z.object({
    productId: z.string().refine((id) => mongoose.Types.ObjectId.isValid(id), {
        message: 'Please select a product'
    })
}).extend(ReviewIdZodSchema.shape);

export const ReviewListByQueryZodSchema = z.object({
    pId: z.string().refine((id) => mongoose.Types.ObjectId.isValid(id), {
        message: 'Please select a product'
    }),
    page:z.string().optional()
});

export type Review = z.infer<typeof ReviewZodSchema>;
export type ReviewId = z.infer<typeof ReviewIdZodSchema>;
export type ReviewListByQuery = z.infer<typeof ReviewListByQueryZodSchema>;
export type ReviewDeleteParams = z.infer<typeof ReviewDeleteZodSchema>;

