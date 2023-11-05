import { type AnyZodObject } from 'zod'
import { type NextFunction, type Request, type Response } from 'express'

export default interface RequestValidators {
  params?: AnyZodObject
  body?: AnyZodObject
  query?: AnyZodObject
}

export function VALIDATE_REQUEST (validators: RequestValidators) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (validators.params != null) {
        req.params = await validators.params.parseAsync(req.params)
      }
      if (validators.body != null) {
        req.body = await validators.body.parseAsync(req.body)
      }
      if (validators.query != null) {
        req.query = await validators.query.parseAsync(req.query)
      }
      next()
    } catch (error) {
      next(error)
    }
  }
}
