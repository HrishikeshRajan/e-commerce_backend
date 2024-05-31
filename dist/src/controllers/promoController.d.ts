import { Request, Response, NextFunction } from "express";
import { IResponse } from "types/IResponse.interfaces";
export declare const create: (req: Request, res: Response<IResponse>, next: NextFunction) => Promise<void>;
export declare const get: (req: Request, res: Response<IResponse>, next: NextFunction) => Promise<void>;
export declare const getAllPromos: (req: Request, res: Response<IResponse>, next: NextFunction) => Promise<void>;
export declare const updatePromoStatus: (req: Request, res: Response<IResponse>, next: NextFunction) => Promise<void>;
//# sourceMappingURL=promoController.d.ts.map