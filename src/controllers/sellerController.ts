import { type NextFunction, type Request, type Response } from "express";
import CustomError from "@utils/CustomError";
import userService from '@services/user.services';
import UserRepository from "@repositories/user.repository";

export const update = async (
    req:Request, 
    res:Response,
     next:NextFunction):Promise<void> => {
    try {
        const userRepo = new UserRepository()
        const service = new userService()
        const user = await service.findUser(userRepo,{_id:req.user.id},false)
        res.status(200).json(user)
        
    } catch (error) {
        const errorObj = error as CustomError;
        next(new CustomError(errorObj.message, errorObj.code, false))
    }
}