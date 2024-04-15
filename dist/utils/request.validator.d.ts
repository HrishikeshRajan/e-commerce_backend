import { type AnyZodObject } from 'zod';
import { type NextFunction, type Request, type Response } from 'express';
export default interface RequestValidators {
    params?: AnyZodObject;
    body?: AnyZodObject;
    query?: AnyZodObject;
}
export declare function VALIDATE_REQUEST(validators: RequestValidators): (req: Request, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=request.validator.d.ts.map