/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { type Request, type Response, type NextFunction } from 'express'
import CustomError from '../utils/CustomError'

import JwtServices from '../services/jwt.services'
import JWT from '@utils/Jwt.utils'
import { GenericRequest, Token, UserCore } from 'types/IUser.interfaces'
import { merge } from 'lodash'

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
    const token = (req.cookies) ? req.cookies.token : null
    if (!(token)) { next(new CustomError('Unauthorized: Access is denied due to invalid credentials', 401, false)); return }

    const jwtConfig = {
      secret: process.env.JWT_SECRET as string
    }

    const jwt = new JWT()
    const decodedObj = new JwtServices().verifyToken(jwt, token, jwtConfig.secret)
    if (decodedObj.status === 'failure' && decodedObj.code === 403) {
      next(new CustomError('Please Login', 401, false)); return
    }
    const tokenData = { ...decodedObj.message.data } as Token
    

    // Throw error if another user id is submitted
    if(req.user?._id !== tokenData.id){
       next(new CustomError('Id are not matching', 401, false)); return 
    }
    merge(req,{user:tokenData} )
  } catch (error: unknown) {
    const errorObj = error as CustomError
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
