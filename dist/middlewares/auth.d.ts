import { type Request, type Response, type NextFunction } from 'express';
import { GenericRequest, UserCore } from 'types/IUser.interfaces';
/**
 * Ensures that the user is logged in for accessing the protected routes.
 *
 * @param req
 * @param res
 * @param next
 * @returns callback {next}
 *
 */
export declare const isLoggedIn: (req: GenericRequest<{}, {}, UserCore>, res: Response, next: NextFunction) => void;
export declare const disallowLoggedInUsers: (req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=auth.d.ts.map