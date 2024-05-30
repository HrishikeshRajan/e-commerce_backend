import jwt, { type JwtPayload } from 'jsonwebtoken';
import { type IJWT } from '../types/IJwt.interfaces';
type JwtSuccess = {
    status: string;
    message: {
        data: any;
    };
    code: number;
};
type JwtError = {
    status: string;
    message: {
        err: any;
    };
    code: number;
};
export type JwtValidationResponse = JwtSuccess | JwtError;
export declare const isJwtValidationSuccess: (response: JwtValidationResponse) => response is JwtSuccess;
declare class JwtRepository_v2 implements IJWT {
    protected jwt: typeof jwt;
    constructor();
    sign(payload: JwtPayload, SECRET: string, expiry: string | number): string;
    verify(token: string, SECRET: string): JwtValidationResponse;
    decode(payload: string): any;
}
export default JwtRepository_v2;
//# sourceMappingURL=Jwt.utils.d.ts.map