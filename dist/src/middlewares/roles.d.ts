import { type Response, type NextFunction } from 'express';
import { GenericRequest, Token } from 'types/IUser.interfaces';
/**
 *
 * @param {string} roles
 * @returns
 */
export declare const Role: (...roles: string[]) => (req: GenericRequest<{}, {}, Token>, _: Response, next: NextFunction) => void;
//# sourceMappingURL=roles.d.ts.map