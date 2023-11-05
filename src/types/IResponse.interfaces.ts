import { type Response } from 'express'
export interface IResponse {
  res: Response
  success: boolean
  statusCode: number
  message: Record<string, any>

}
