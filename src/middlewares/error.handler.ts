import { type NextFunction, type Request, type Response } from 'express'
import { ZodError } from 'zod'
import { sendHTTPResponse } from '../services/response.services'

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction): void => {
  if (err instanceof ZodError) {
    sendHTTPResponse({ res, message: { error: err.errors }, statusCode: 422, success: false }); return
  }
  sendHTTPResponse({ res, message: { error: err.message ?? 'Server internal error' }, statusCode: err.code ?? 500, success: err.success ?? false })
}
