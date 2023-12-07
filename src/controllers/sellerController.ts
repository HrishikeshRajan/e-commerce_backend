
import { type NextFunction, type Request, type Response } from "express";
import CustomError from "@utils/CustomError"
import userService from '@services/user.services'
import UserRepository from "@repositories/user.repository";
import { get, merge } from "lodash";
import { GenericRequest, Token, UserCore } from "types/IUser.interfaces";
import { IResponse } from "types/IResponse.interfaces";
import { sendHTTPResponse } from "@services/response.services";
import { StatusCodes } from "http-status-codes";
import { userFilter } from "@utils/user.helper";

export const update = async (
    req: GenericRequest<{}, {}, Token>,
    res: Response,
    next: NextFunction): Promise<void> => {
    try {
        const userRepo = new UserRepository()
        // const service = new userService()
        if (!req.user){
            return next(new CustomError('user property not found in req object ', StatusCodes.NOT_FOUND, false));
        }
        const updatedUser = await userRepo.setSeller(req.user.id)
        sendHTTPResponse({ res, message: { mesage: updatedUser }, statusCode: StatusCodes.OK, success: true })

    } catch (error) {
        const errorObj = error as CustomError;
        next(new CustomError(errorObj.message, errorObj.code, false))
    }
}
/**
 * Middleware that injects a user object into the req object.
 * @param {GenericRequest} req 
 * @param res 
 * @param next 
 * @param {string} id 
 * @returns void 
 */
export const injectUser = async (
    req: GenericRequest<{}, {}, {}>,
    res: Response<IResponse>,
    next: NextFunction,
    id: string): Promise<void> => {

    const userRepo = new UserRepository()
    const service = new userService()
    const userObject = await service.getUser(userRepo, id)

    if (!userObject) {
        return next(new CustomError('User not found', StatusCodes.NOT_FOUND, false))
    }
    const user = { user: userFilter(userObject) };
    merge(req, user)
    next()
}