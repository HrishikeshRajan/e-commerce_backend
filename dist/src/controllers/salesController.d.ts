import { Request, Response, NextFunction } from 'express';
import { IResponse } from 'types/IResponse.interfaces';
export declare const create: (req: Request, res: Response<IResponse, {}>, next: NextFunction) => Promise<void>;
export declare const get: (req: Request, res: Response<IResponse, {}>, next: NextFunction) => Promise<void>;
export declare const moveToCart: (req: Request, res: Response<IResponse, {}>, next: NextFunction) => Promise<void>;
//# sourceMappingURL=salesController.d.ts.map