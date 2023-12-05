/**
 * @description This files contain all the custom types for accessing Jwt repository
 */

import { JwtPayload } from "jsonwebtoken";



/**
 * @description This interface act as an abstraction for accessing Jwt repository
 */
export interface IJWT{
    sign(payload:JwtPayload, SECRET:string, expiry:string):any;
    verify(payload:string, SECRET:string):any;
    decode(payload:string):any;
}


