import jwt, { type JwtPayload, type SignOptions } from 'jsonwebtoken'
import { type IJWT } from '../types/IJwt.interfaces'

type JwtSuccess = {
  status: string
  message: { data: any },
  code: number
}

type JwtError = {
  status: string
  message: { err: any },
  code: number
}

export type JwtValidationResponse = JwtSuccess | JwtError


export const isJwtValidationSuccess = (response: JwtValidationResponse): response is JwtSuccess => {
  return (response as JwtSuccess).message.data !== undefined
}
class JwtRepository_v2 implements IJWT {
  protected jwt: typeof jwt
  constructor() {
    this.jwt = jwt
  }

  sign(payload: JwtPayload, SECRET: string, expiry: string | number): string {
    const signOptions: SignOptions = {
      expiresIn: expiry,
      algorithm: 'HS256'
    }
    return this.jwt.sign(payload, SECRET, signOptions)
  }

  verify(token: string, SECRET: string): JwtValidationResponse {
    try {
      const payload = this.jwt.verify(token, SECRET) as JwtPayload
      return ({ status: 'success', message: { data: payload }, code: 200 })
    } catch (error) {
      return ({ status: 'failure', message: { err: (error as Error).message }, code: 403 })
    }
  }

  decode(payload: string): any {
    try {
      return this.jwt.decode(payload) as JwtPayload
    } catch (error) {
      return ({
        err: error,
        statusCode: 400
      })
    }
  }
}

export default JwtRepository_v2
