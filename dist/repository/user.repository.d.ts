/// <reference types="mongoose/types/aggregate" />
/// <reference types="mongoose/types/callback" />
/// <reference types="mongoose/types/collection" />
/// <reference types="mongoose/types/connection" />
/// <reference types="mongoose/types/cursor" />
/// <reference types="mongoose/types/document" />
/// <reference types="mongoose/types/error" />
/// <reference types="mongoose/types/expressions" />
/// <reference types="mongoose/types/helpers" />
/// <reference types="mongoose/types/middlewares" />
/// <reference types="mongoose/types/indexes" />
/// <reference types="mongoose/types/models" />
/// <reference types="mongoose/types/mongooseoptions" />
/// <reference types="mongoose/types/pipelinestage" />
/// <reference types="mongoose/types/populate" />
/// <reference types="mongoose/types/query" />
/// <reference types="mongoose/types/schemaoptions" />
/// <reference types="mongoose/types/schematypes" />
/// <reference types="mongoose/types/session" />
/// <reference types="mongoose/types/types" />
/// <reference types="mongoose/types/utility" />
/// <reference types="mongoose/types/validation" />
/// <reference types="mongoose/types/virtuals" />
/// <reference types="mongoose/types/inferschematype" />
/**
 * User Class
 * @author Hrishikesh rajan // https://github.com/HrishikeshRajan
 *
 */
import { type IUserRepository, type IUser, type UserParam, type IAddress, type UserWithId, UserCore } from '../types/IUser.interfaces';
import { type Query, type FilterQuery } from 'mongoose';
import { type imageUrl } from '../types/cloudinary.interfaces';
declare class UserRepository implements IUserRepository {
    #private;
    private readonly userSchema;
    constructor();
    /**
     * Returns user as plain javascript Object
     * @param userId
     * @returns user object
     */
    get(userId: string): Promise<any>;
    /**
     * Updates both seller and role property
     * @param {string} userId
     * @returns
     */
    setSeller(userId: string): Promise<UserCore | null>;
    /**
       * Deletes the user document
       *
       * @param {UserParam} param  - The user document will be deleted based on the param
       * @returns {Promise<UserWithId>} - plain javacript object of deleted user document
       * @throws - Mongoose error if occur
       */
    deleteUser(param: FilterQuery<UserParam>): Promise<UserWithId>;
    setEmailVerified(user: UserWithId): Promise<any>;
    convertToUserObject(user: UserWithId): Promise<UserWithId>;
    /**
       * Finds user based on param
       *
       * @param {Object} key - Document is searched based on this key
       * @param {Boolean} includePassword - Set to true if you want document with password field
       * @returns { Promise< Query<UserWithId | null, UserWithId >>>} - The user if exists else return null.
       * @throws {CustomError} - Throws http error if any failure occurs
       */
    findUser(key: FilterQuery<UserParam>, includePassword?: boolean): Promise<Query<UserWithId | null, UserWithId>>;
    /**
         * Finds all the users
         *
         * @returns {Promise<Array<IUser> | null>} - The user if exists else return null.
         * @throws {CustomError} - Throws http error if any failure occurs
         */
    findAllUsers(): Promise<Query<UserWithId[] | null, UserWithId>>;
    /**
         * create a new user document
         * @param {Record<string, unknown>} fields - user inputs that allowed in the user schema
         * @returns {Promise<IUser>} - a promise of created user document
         * @throws - mongoose Error
         */
    create(fields: Record<string, unknown>): Promise<IUser>;
    /**
     *
     * @param {IAddress} address - Addresss fields
     * @param {string} userId
     * @returns - user document
     */
    addAddress(address: IAddress, userId: FilterQuery<string>): Promise<Query<UserWithId | null, UserWithId>>;
    fetchAddresses(userId: FilterQuery<string>): Promise<Query<IAddress[] | null, IAddress>>;
    /**
       * Update the user document fields in database.     *
       * @param {UserWithId} mongooseObj
       */
    saveToDatabase(mongooseObj: UserWithId): Promise<UserWithId>;
    /**
     * Assigns the user document with new address fileds
     *
     * @param {UserWithId} data
     * @param {string} addressId
     * @param {IAddress} newAddress
     * @returns modified mongoose user instance
     */
    updateAddressHelper(data: UserWithId, addressId: string, newAddress: IAddress): UserWithId;
    /**
       *Updates the new fields with existing document
       *
       * @param {IAddress} newAddress
       * @param userId
       * @param addressId
       * @returns user with id field
       */
    updateAddress(newAddress: IAddress, userId: string, addressId: string): Promise<IAddress | null>;
    resetPassword(email: FilterQuery<Record<string, string>>, password: string): Promise<UserWithId | null>;
    private calculateExpiry;
    addForgotTokenId(email: FilterQuery<string>): Promise<UserWithId | null>;
    resetFormToken(email: string): Promise<string | undefined>;
    verifyPassword(user: UserWithId, password: string): Promise<any>;
    changePassword(fields: {
        id: FilterQuery<Record<string, string>>;
        currentPassword: string;
        newPassword: string;
    }): Promise<UserWithId | null | boolean>;
    deleteAddress(addressId: string, userId: string): Promise<UserWithId | null>;
    updateUserProfile(fields: any, userId: string): Promise<UserWithId | null>;
    setProfilePicture(fields: imageUrl, userId: string): Promise<UserWithId | null>;
    deleteProfilePicture(userId: string): Promise<UserWithId | null>;
    getForgotPasswordToken(id: string): Promise<(import("mongoose").Document<unknown, {}, IUser> & Omit<IUser & {
        _id: import("mongoose").Types.ObjectId;
    }, never>) | null>;
}
export default UserRepository;
//# sourceMappingURL=user.repository.d.ts.map