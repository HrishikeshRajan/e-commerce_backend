import { UserCore, type UserWithId } from '../types/IUser.interfaces';
import { type Request } from "express";
export declare const responseFilter: (user: UserWithId) => any;
export declare const userFilter: (user: UserCore) => UserCore;
export declare const getUserId: (req: Request) => any;
//# sourceMappingURL=user.helper.d.ts.map