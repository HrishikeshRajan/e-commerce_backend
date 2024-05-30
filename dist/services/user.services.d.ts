import { type Query, type FilterQuery } from 'mongoose';
import { type IUserRepository, type IUser, type UserParam, type UserWithId, type IAddress } from '../types/IUser.interfaces';
import { type imageUrl } from '../types/cloudinary.interfaces';
/**
 * Higher level class that act as an interface for the client
 * Author - Hrishikesh Rajan
 */
declare class UserServices {
    /**
        * Interface for creating user document
        *
        * @param {IUserRepository} userRepoObject - An instance of the User repository class
        * @param {Record<string, unknown>} fields - Any user fileds that are available in user schema
        * @returns {Promise<Document<IUser>>} - the user document.
        */
    createUser(userRepoObject: IUserRepository, fields: Record<string, unknown>): Promise<IUser>;
    /**
         * Interface to find single user
         *
         * @param {IUserRepository} userRepoObject - An instance of the User class.
         * @param {FilterQuery<UserParam>} key - The field to search for the user.
         * @param {boolean} [includePassword=false] - Specify includePassword = true to include the password in the result.
         * @returns { Promise<Query<UserWithId | null, UserWithId>> } - The user document if found, otherwise returns null.
         */
    findUser(userRepoObject: IUserRepository, key: FilterQuery<UserParam>, includePassword?: boolean): Promise<Query<UserWithId | null, UserWithId>>;
    /**
     * @param {IUserRepository} userRepoObject  - User dependency injection
     * @param {string} userId - mongoose document id
     * @returns User object
     */
    getUser(userRepoObject: IUserRepository, userId: string): Promise<any>;
    /**
         *Interface to find all users
         *
         * @param {IUserRepositiory}  userRepoObject - An instance of the User Class.
         * @returns {Promise<IUser | null>} - Returns user document if exists else return null
         */
    findAllUsers(userRepoObject: IUserRepository): Promise<Query<UserWithId[] | null, UserWithId>>;
    /**
         * Interface to delete specific user
         *
         * @param {IUserRepository} userRepoObject - An instance of the User Class
         * @param { FilterQuery<IFindOption>} key - The criteria to identify the user to be deleted.
         * @returns {Promise<any>} - the deleted user document
         */
    findUserAndDelete(userRepoObject: IUserRepository, key: UserParam): Promise<any>;
    /**
         * Interface to update the user address
         *
         * @param {IUserRepository} userRepoObject
         * @param {IAddress} fields
         * @returns mongoose user instance;
         */
    updateAddress(userRepoObject: IUserRepository, fields: any): Promise<IAddress | null>;
    addAddress(userRepoObject: IUserRepository, fields: any): Promise<UserWithId | null>;
    resetPassword(userRepoObject: IUserRepository, fields: any): Promise<UserWithId | null>;
    addForgotPasswordTokenID(userRepoObject: IUserRepository, fields: any): Promise<UserWithId | null>;
    updatePassword(userRepoObject: IUserRepository, fields: any): Promise<UserWithId | null | boolean>;
    fetchAddressByUserId(userRepoObject: IUserRepository, fields: FilterQuery<string>): Promise<IAddress[] | null>;
    deleteAddressById(userRepoObject: IUserRepository, fields: {
        addressId: string;
        userId: string;
    }): Promise<UserWithId | null>;
    updateUserProfile(userRepoObject: IUserRepository, fields: FilterQuery<Record<string, string>>, userId: string): Promise<UserWithId | null>;
    updateImageUrl(userRepoObject: IUserRepository, fields: imageUrl, userId: string): Promise<UserWithId | null>;
    deleteProfilePicture(userRepoObject: IUserRepository, userId: string): Promise<UserWithId | null>;
    setEmailVerified(userRepoObject: IUserRepository, user: UserWithId): Promise<any>;
    verifyPassword(userRepoObject: IUserRepository, user: UserWithId, password: string): Promise<any>;
    getResetFormToken(userRepoObject: IUserRepository, email: string): Promise<any>;
    getForgotPasswordToken(userRepoObject: IUserRepository, id: string): Promise<any>;
    setSeller(userRepoObject: IUserRepository, userId: string): Promise<import("../types/IUser.interfaces").UserCore | null>;
}
export default UserServices;
//# sourceMappingURL=user.services.d.ts.map