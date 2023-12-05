import { type NextFunction, type Request, type Response } from "express";
import CustomError from "@/src/utils/CustomError";
import userService from '@/src/services/user.services';
import UserRepository from "@/src/repository/user.repository";
export const update = async (
    req:Request, 
    res:Response,
     next:NextFunction):Promise<void> => {
    try {

        const userRepo = new UserRepository()
        const service = new userService()
        const user = service.findUser(userRepo,{_id:req.user._id},false)
        res.status(200).json(user)
        
    } catch (error) {
        const errorObj = error as CustomError;
        next(new CustomError(errorObj.message, errorObj.code, false))
    }
}