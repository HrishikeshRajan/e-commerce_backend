import { type NextFunction, type Request, type Response } from 'express'
import { ZodError } from 'zod'
import { sendHTTPResponse } from '../services/response.services'

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction): void => {
  if (err instanceof ZodError) {
    sendHTTPResponse({ res, message: { error: err.errors }, statusCode: 422, success: false }); return
  }
  sendHTTPResponse({ res, message: { error: err.message ?? 'Server Internal Error' }, statusCode: err.code ?? 500, success: err.success ?? false })
}

// Not Found Error Handler

// If we hit a route that is not found, we mark it as 404 and pass it along to the next error handler to display
export const notFound = (req:Request, res:Response, next:NextFunction) => {
  sendHTTPResponse({res,message:{message:'Url doesn\'t exits'},statusCode:404, success:false})
};

