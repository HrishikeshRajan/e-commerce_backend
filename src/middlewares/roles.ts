import CustomError from '@utils/CustomError'
import { type Request, type Response, type NextFunction } from 'express'
import { StatusCodes } from 'http-status-codes'
import { isEmpty } from 'lodash'
import { GenericRequest, Token } from 'types/IUser.interfaces'
import Logger from '@utils/LoggerFactory/LoggerFactory'
const logger = Logger()


/**
 * 
 * @param {string} roles 
 * @returns 
 */
export const Role = (...roles: string[]) => {
    logger.info('Checking user role')
    return (req: GenericRequest<{}, {}, Token>, _: Response, next: NextFunction) => {
        if (!isEmpty(req.user)) {
            if (!roles.includes(req.user.role)) {
                logger.error(`User not activated seller account, userId: ${req.user.id} `)
                next(new CustomError('You need to activate the seller account', StatusCodes.FORBIDDEN, false))
            }
            logger.info('Role validation successfull')
            next()
        }
    }

}
