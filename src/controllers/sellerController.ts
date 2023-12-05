import { type NextFunction, type Request, type Response } from "express";
import CustomError from "../utils/CustomError";

export const update = async (
    req:Request, 
    res:Response,
     next:NextFunction):Promise<void> => {
    try {

        console.log('shop')
        
    } catch (error) {
        const errorObj = error as CustomError;
        next(new CustomError(errorObj.message, errorObj.code, false))
    }
}