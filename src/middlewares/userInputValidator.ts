import { type AnyZodObject } from 'zod'
import { type Request, type Response, type NextFunction } from 'express'

export default interface RequestValidators {
  params?: AnyZodObject
  body?: AnyZodObject
  query?: AnyZodObject
}

export function validateRequest (validators: RequestValidators) {
  return async (req: Request, res: Response, next: NextFunction) => {
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
