import CustomError from '@utils/CustomError'
import { type Request, type Response, type NextFunction } from 'express'
import { StatusCodes } from 'http-status-codes'
import { isEmpty } from 'lodash'
import { GenericRequest, Token } from 'types/IUser.interfaces'

/**
 * 
 * @param {string} roles 
 * @returns 
 */
export const Role = (...roles: string[]) => {
    return (req: GenericRequest<{}, {}, Token>, _: Response, next: NextFunction) => {

        if (!isEmpty(req.user)) {
            if (!roles.includes(req.user.role)) {
                next(new CustomError('You need to activate the seller account', StatusCodes.FORBIDDEN, false))
            }
            next()
        }
    }

}
