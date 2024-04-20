/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { type Request, type Response, type NextFunction } from 'express'

import JwtRepository, { isJwtValidationSuccess } from '../utils/Jwt.utils'
import JwtServices from '../services/jwt.services'
import { sendHTTPWithTokenResponse } from '../services/response.services'
import { type ICookieResponse } from '../types/Cookie.interfaces'
import logger from '@utils/LoggerFactory/Logger'

const JWT = new JwtRepository()
const jwtService = new JwtServices()

const deserializeUser = (req: Request, res: Response, next: NextFunction): void => {
  logger.info('Checking Access token in request cookie');
  if (req.cookies.token && req.cookies.refreshToken) {
    const accessToken = jwtService.verifyToken(JWT, req.cookies.token, process.env.JWT_SECRET as string)
    if (isJwtValidationSuccess(accessToken)) {
      /**
       * If token valid then just pass to next middleware
       */
      logger.info('Access token is valid. Proceeding to next middleware.');
      return next();
    } else {

      logger.info('Access token invalid. Validating refresh token.');
      /**
       * Check refresh token is valid. If valid then create new access token as assign to cookie
       * else clear both cookies
       */
      const refreshToken = jwtService.verifyToken(JWT, req.cookies?.refreshToken, process.env.JWT_SECRET as string)
      if (isJwtValidationSuccess(refreshToken)) {
        const { email, id, loggedIn, role } = refreshToken.message.data
        const payload = {
          email,
          id,
          loggedIn,
          role,
        }
        logger.info('Refresh token is valid. Creating new access token and updating cookie.');
        //New access token
        const newAccessToken = new JwtServices().signPayload(JWT, payload, process.env.JWT_SECRET as string, process.env.ACCESS_TOKEN_EXPIRTY_DEV as string)
        req.cookies.token = newAccessToken
      } else {
        logger.error('Both access and refresh tokens are invalid. Clearing cookies.');
        //clear both tokens
        const time = 0
        const cookieConfig: ICookieResponse = {
          res,
          token: null,
          message: {
            refreshToken: null
          },
          cookie: {
            expires: time
          },
          success: true,
          statusCode: 200
        }
        return sendHTTPWithTokenResponse(cookieConfig);
      }

    }
  } else if (!req.cookies.token && req.cookies.refreshToken) {
    console.log('token', req.cookies.token, 'refreshTOken', req.cookies.refreshToken)
    logger.info('Access Token is missing. Validating refresh token.');
    const refreshToken = jwtService.verifyToken(JWT, req.cookies?.refreshToken, process.env.JWT_SECRET as string)
    console.log(refreshToken) 
    if (isJwtValidationSuccess(refreshToken)) {
        const { email, id, loggedIn, role } = refreshToken.message.data
        const payload = {
          email,
          id,
          loggedIn,
          role,
        }
        logger.info('Refresh token is valid. Creating new access token and updating cookie.');
        //New access token
        const newAccessToken = new JwtServices().signPayload(JWT, payload, process.env.JWT_SECRET as string, process.env.ACCESS_TOKEN_EXPIRTY_DEV as string)
        req.cookies.token = newAccessToken
      } else {
        logger.error('Both access and refresh tokens are invalid. Clearing cookies.');
        //clear both tokens
        const time = 0
        const cookieConfig: ICookieResponse = {
          res,
          token: null,
          message: {
            refreshToken: null
          },
          cookie: {
            expires: time
          },
          success: true,
          statusCode: 200
        }
        return sendHTTPWithTokenResponse(cookieConfig);
      }
  }
  logger.info('No token found. Proceeding to public APIs.');
  //To access public apis
  return next()
}

export default deserializeUser
