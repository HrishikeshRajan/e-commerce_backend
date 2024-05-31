import { ReviewDocument } from "@models/reviewModel";
import { type Request, type Response, type NextFunction } from "express";
import { IResponse } from "types/IResponse.interfaces";
import { ReviewDeleteParams, ReviewListByQuery, type Review, type ReviewId } from "types/zod/review.schema.zod";
export declare const create: (req: Request, res: Response<IResponse>, next: NextFunction) => Promise<void>;
export declare const edit: (req: Request<ReviewId, ReviewDocument, Review, {}>, res: Response<IResponse>, next: NextFunction) => Promise<void>;
export declare const deleteReview: (req: Request<ReviewDeleteParams>, res: Response<IResponse>, next: NextFunction) => Promise<void>;
export declare const getReviewsByProductId: (req: Request<{}, ReviewDocument[], {}, ReviewListByQuery>, res: Response<IResponse>, next: NextFunction) => Promise<void>;
//# sourceMappingURL=reviewController.d.ts.map