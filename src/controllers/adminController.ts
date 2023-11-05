import CustomError from '../utils/CustomError'
import UserRepository from '../repository/user.repository'
import UserServices from '../services/user.services'
import { type IUserRepository } from '../types/IUser.interfaces'
import { sendHTTPResponse } from '../services/response.services'
import { type IResponse } from '../types/IResponse.interfaces'
import { type Request, type Response, type NextFunction } from 'express'
import { StatusCodes } from 'http-status-codes'
const userRespository: IUserRepository = new UserRepository()
const userService: UserServices = new UserServices()

export const getAllUsers = async (
  req: Request,
  res: Response<IResponse>,
  next: NextFunction):
Promise<void> => {
  try {
    const users = await userService.findAllUsers(userRespository)
    const response: IResponse = {
      message: { users },
      success: true,
      statusCode: StatusCodes.OK,
      res
    }
    sendHTTPResponse(response)
  } catch (error: unknown) {
    console.log(error)
    const errorObj = error as CustomError
    next(new CustomError(errorObj.message, errorObj.code, false))
  }
}
export const deleteUser = async (
  req: Request,
  res: Response<IResponse>,
  next: NextFunction):
Promise<void> => {
  try {
    const user = await userService.findUserAndDelete(userRespository, { _id: req.params.id })
    const response: IResponse = {
      message: { user },
      success: true,
      statusCode: StatusCodes.OK,
      res
    }
    sendHTTPResponse(response)
  } catch (error: unknown) {
    console.log(error)
    const errorObj = error as CustomError
    next(new CustomError(errorObj.message, errorObj.code, false))
  }
}
