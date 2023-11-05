import { type IResponse } from './IResponse.interfaces'

export interface IToken {
  token: string | null
}

export interface ICookieResponse extends IResponse, IToken {
  cookie?: {
    [x: string]: any
    expires: number | string

  }
};
