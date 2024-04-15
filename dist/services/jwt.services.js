"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable class-methods-use-this */
class JwtServices {
    /**
        * @description  An abstract method for jwt sign and uses Jwt concrete module as dependency
        *
        * @param {IJWT} jwt - Object of concrete jwt class
        * @param {JwtPayload} payload - Fields to email and userId
        * @param {string} SECRET - This is the secrect key for jwt to hash the payload
        * @param {string} expiry - This is time for validity of token
        * @returns {string} - The newly created jwt token is returned.
        */
    signPayload(jwt, payload, SECRET, expiry) {
        return jwt.sign(payload, SECRET, expiry);
    }
    /**
        * @description An abstract method for jwt verify and uses Jwt concrete module as dependency
        *
        * @param {IJWT} jwt - Object of concrete jwt class
        * @param {JwtPayload} payload - Fields to encrypt email , userId and token
        * @returns {JwtPayload} - The object that encrypted - email, userId
        * @returns {string} - The newly created jwt token is returned.
        */
    verifyToken(jwt, payload, SECRET) {
        return jwt.verify(payload, SECRET);
    }
    /**
       * This function decodes the token. This is mainly used to ready the expired token.
       * @param jwt
       * @param payload
       * @returns {JwtPayload}
       */
    decodeToken(jwt, payload) {
        return jwt.decode(payload);
    }
}
exports.default = JwtServices;
//# sourceMappingURL=jwt.services.js.map