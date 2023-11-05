/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { type Request, type Response, type NextFunction } from 'express'

import JwtRepository from '../utils/Jwt.utils'
import JwtServices from '../services/jwt.services'
import { sendHTTPWithTokenResponse } from '../services/response.services'
import { type ICookieResponse } from '../types/Cookie.interfaces'

const JWT = new JwtRepository()
const jwtService = new JwtServices()

const deserializeUser = (req: Request, res: Response, next: NextFunction): void => {
  if (req.cookies.token) {
    const accessTokenPayload = jwtService.verifyToken(JWT, req.cookies.token, process.env.JWT_SECRET as string)

    if (accessTokenPayload.message.err === 'jwt expired') {
      const extractedRefreshToken = jwtService.verifyToken(JWT, req?.cookies?.refreshToken, process.env.JWT_SECRET as string)

      if (extractedRefreshToken.message.err) {
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
        sendHTTPWithTokenResponse(cookieConfig); return
      } else if (extractedRefreshToken.success === 'success') {
        const { email, id } = extractedRefreshToken.message.data
        const payload = {
          email,
          id
        }
        const newAccessToken = new JwtServices().signPayload(JWT, payload, process.env.JWT_SECRET as string, process.env.ACCESS_TOKEN_EXPIRTY_DEV as string)
        req.cookies.token = newAccessToken
      }
    } else if (accessTokenPayload.message.err) {
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

      sendHTTPWithTokenResponse(cookieConfig); return
    }
    if (accessTokenPayload.success === 'success') {
      next(); return
    }
  }
  next()
}

export default deserializeUser
