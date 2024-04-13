import { type NextFunction, type Request, type Response } from 'express'
import { ZodError } from 'zod'
import { sendHTTPErrorResponse, sendHTTPResponse } from '../services/response.services'
import CustomError from '@utils/CustomError';
import rateLimit from 'express-rate-limit';

/* v1 */
export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction): void => {
  if (err instanceof ZodError) {
    sendHTTPResponse({ res, message: { error: err.errors }, statusCode: 422, success: false }); return
  }
  sendHTTPResponse({ res, message: { error: err.message ?? 'Server Internal Error' }, statusCode: err.code ?? 500, success: err.success ?? false })
}

/* v2 */
export const errorHandlerV2 = (err: unknown, req: Request, res: Response, next: NextFunction): void => {
  if (err instanceof ZodError) {
    return sendHTTPErrorResponse({ res, error: err.errors, statusCode: 422, success: false });
  }
  if (err instanceof CustomError) {
    return sendHTTPErrorResponse({ res, error: err.message || 'Server Internal Error', statusCode: err.code ?? 500, success: false })
  }
  if (err instanceof Error) {
    return sendHTTPErrorResponse({ res, error: err.message || 'Server Internal Error', statusCode: 500, success: false })
  }
  return sendHTTPErrorResponse({ res, error: 'Server Internal Error', statusCode: 500, success: false })
  
}

export const productionErrorHandler = (err: any, req: Request, res: Response, next: NextFunction): void => {
  sendHTTPResponse({ res, message: { error: err.message ?? 'Server Internal Error' }, statusCode: 500, success: false })
}

// Not Found Error Handler

// If we hit a route that is not found, we mark it as 404 and pass it along to the next error handler to display
export const notFound = (req: Request, res: Response, next: NextFunction) => {
  sendHTTPResponse({ res, message: { message: 'Url doesn\'t exits' }, statusCode: 404, success: false })
};

