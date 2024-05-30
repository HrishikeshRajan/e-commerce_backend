import { type NextFunction, type Request, type Response } from 'express';
export declare const errorHandler: (err: any, req: Request, res: Response, next: NextFunction) => void;
export declare const errorHandlerV2: (err: unknown, req: Request, res: Response, next: NextFunction) => void;
export declare const productionErrorHandler: (err: any, req: Request, res: Response, next: NextFunction) => void;
export declare const notFound: (req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=error.handler.d.ts.map