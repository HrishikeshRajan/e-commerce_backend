import jwt, { type JwtPayload, type SignOptions } from 'jsonwebtoken'
import { type IJWT } from '../types/IJwt.interfaces'

class JwtRepository_v2 implements IJWT {
  protected jwt: typeof jwt
  constructor () {
    this.jwt = jwt
  }

  sign (payload: JwtPayload, SECRET: string, expiry: string | number): string {
    const signOptions: SignOptions = {
      expiresIn: expiry,
      algorithm: 'HS256'
    }
    return this.jwt.sign(payload, SECRET, signOptions)
  }

  verify (token: string, SECRET: string): any {
    try {
      const payload = this.jwt.verify(token, SECRET) as JwtPayload
      return ({ status: 'success', message: { data: payload, err: null }, code: 200 })
    } catch (error: any) {
      return ({ status: 'failure', message: { err: error.message }, code: 403 })
    }
  }

  decode (payload: string): any {
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
