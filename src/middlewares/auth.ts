/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { type Request, type Response, type NextFunction } from 'express'
import CustomError from '../utils/CustomError'

import JwtServices from '../services/jwt.services'
import JWT, { isJwtValidationSuccess } from '../utils/Jwt.utils'
import { GenericRequest, Token, UserCore } from 'types/IUser.interfaces'
import { merge } from 'lodash'
import logger from '../utils/LoggerFactory/Logger'


/**
 * Ensures that the user is logged in for accessing the protected routes.
 *
 * @param req
 * @param res
 * @param next
 * @returns callback {next}
 *  
 */
export const isLoggedIn = (req: GenericRequest<{},{},UserCore>, res: Response, next: NextFunction): void => {
  try {
    logger.info('Validating request cookies')
    const token = (req.cookies) ? req.cookies.token : null
    if (!(token)) { 
      logger.info('Cookies are not present')
      return next(new CustomError('Unauthorized: Access is denied due to invalid credentials', 401, false));
    }

    const jwtConfig = {
      secret: process.env.JWT_SECRET as string
    }

    const jwt = new JWT()
    const decodedObj = new JwtServices().verifyToken(jwt, token, jwtConfig.secret)
    if (!isJwtValidationSuccess(decodedObj)) {
      logger.error('Token verification failed. Please Login')
      next(new CustomError('Please Login', 401, false)); return
    }
    const tokenData = { ...decodedObj.message.data } as Token
    

   // Throw an error if a different user ID is provided in the parameters.
    if(req.user?._id && (req.user?._id !== tokenData.id)){
      logger.error('User ID mismatch in request parameters')
     return  next(new CustomError('Id\'s are not matching', 401, false))
    }
    merge(req,{user:tokenData} )
  } catch (error: unknown) {
    const errorObj = error as CustomError
    logger.error(`Error in isLoggedIn middleware: ${errorObj.message} statusCode:${errorObj.code}`)
    next(new CustomError(errorObj.message, errorObj.code, false)); return
  }
  next()
}

export const disallowLoggedInUsers = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const token = req.cookies ? req.cookies.token : null
    if (token) { next(new CustomError('User already loggedIn', 200, true)); return }
  } catch (error: unknown) {
    const errorObj = error as CustomError
    next(new CustomError(errorObj.message, errorObj.code, errorObj.success)); return
  }
  next()
}
