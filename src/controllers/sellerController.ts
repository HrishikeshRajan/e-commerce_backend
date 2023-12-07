
import { type NextFunction, type Request, type Response } from "express";
import CustomError from "@utils/CustomError"
import userService from '@services/user.services'
import UserRepository from "@repositories/user.repository";
import { get } from "lodash";
import { GenericRequest, Token } from "types/IUser.interfaces";
import { IResponse } from "types/IResponse.interfaces";
import { sendHTTPResponse } from "@services/response.services";

export const update = async (
    req: Request,
    res: Response,
    next: NextFunction): Promise<void> => {
    try {
        const userRepo = new UserRepository()
        const service = new userService()
        const userObj = get(req, 'user') as unknown as { id: string };
        // console.log(userObj)
        if (!userObj) {
            return next(new CustomError('userNotFound', 404, false))
        }
        const user = await service.findUser(userRepo, { _id: userObj.id }, false)
        res.status(200).json(user)

    } catch (error) {
        const errorObj = error as CustomError;
        next(new CustomError(errorObj.message, errorObj.code, false))
    }
}
export const injectUser = async (
    req: GenericRequest<{}, {}, {}>,
    res: Response<IResponse>,
    next: NextFunction,
    id:string): Promise<void> => {
        console.log('CALLED ONLY ONCE')
 
    // const userRepo = new UserRepository()
    //     const service = new userService()
    //     const user = service.findUser(userRepo,{_id:})   
next()
}