import { type AnyZodObject } from 'zod';
import { type Request, type Response, type NextFunction } from 'express';
export default interface RequestValidators {
    params?: AnyZodObject;
    body?: AnyZodObject;
    query?: AnyZodObject;
}
export declare function validateRequest(validators: RequestValidators): (req: Request, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=userInputValidator.d.ts.map