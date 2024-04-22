import { type CookieOptions } from 'express'
import { type ICookieResponse } from '../types/Cookie.interfaces'
import { ErrorResponse, type IResponse } from '../types/IResponse.interfaces'

/**
 *
 * @param res {Response}
 * @param message {string}
 * @param statusCode {number}
 * @param success {boolean}
 * @returns {void}
 */
export const sendHTTPResponse = ({ res, message, statusCode, success }: IResponse): void => {
  res.status(statusCode).json({
    success,
    statusCode,
    message

  })
}

/*
* @param res {Response}
* @param message {string}
* @param statusCode {number}
* @param success {boolean}
* @returns {void}
*/
export const sendHTTPErrorResponse = ({ res, error, statusCode, success = false }: ErrorResponse): void => {
 res.status(statusCode).json({
   success,
   statusCode,
   error

 })
}


/**
 *
 * @param res {Response}
 * @param message {string}
 * @param statusCode {number}
 * @param success {boolean}
 * @param token {string}
 * @param cookie {Object}
 * @returns {void}
 */
export const sendHTTPWithTokenResponse = ({ res, message, statusCode, success, token, cookie }: ICookieResponse): void => {
  const expiresIn = parseInt(cookie?.expires as string)
  // 23 hrs
  // set secure:true for production
  const expiryTime = new Date(Date.now() + expiresIn)
  const options: CookieOptions = {
    maxAge:  24 * 60 * 60 * 1000, //  1 day
    httpOnly: true,
    secure: true,  
    sameSite:'none'
  }
  // const accessOptions: CookieOptions = {
  //   maxAge: 2 * 24 * 60 * 60 * 1000, // 1 day
  //   httpOnly: true,
  //   secure: true,
  //   sameSite:'none'
  // }

  if (expiresIn === 0) {
    res.clearCookie('connect.sid', {
      path: '/'
    })
    res.clearCookie('token', {
      path: '/'
    })
    // res.clearCookie('refreshToken', {
    //   path: '/'
    // }) 

    res.status(statusCode).json({
      success,
      statusCode,
      message

    })
    return
  }

  // res.cookie('refreshToken', message?.refreshToken, accessOptions)

  res.status(statusCode).cookie('token', token, options).json({
    success,
    statusCode,
    message

  })
}
