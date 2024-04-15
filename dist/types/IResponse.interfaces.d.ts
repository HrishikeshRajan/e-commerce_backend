import { type Response } from 'express';
export interface IResponse {
    res: Response;
    success: boolean;
    statusCode: number;
    message: Record<string, any>;
}
export interface ErrorResponse {
    res: Response;
    success: boolean;
    statusCode: number;
    error: Record<string, any> | string;
}
//# sourceMappingURL=IResponse.interfaces.d.ts.map