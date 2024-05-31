"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Higher level class that act as an interface for the client
 * Author - Hrishikesh Rajan
 */
class UserServices {
    /**
        * Interface for creating user document
        *
        * @param {IUserRepository} userRepoObject - An instance of the User repository class
        * @param {Record<string, unknown>} fields - Any user fileds that are available in user schema
        * @returns {Promise<Document<IUser>>} - the user document.
        */
    async createUser(userRepoObject, fields) {
        return await userRepoObject.create(fields);
    }
    /**
         * Interface to find single user
         *
         * @param {IUserRepository} userRepoObject - An instance of the User class.
         * @param {FilterQuery<UserParam>} key - The field to search for the user.
         * @param {boolean} [includePassword=false] - Specify includePassword = true to include the password in the result.
         * @returns { Promise<Query<UserWithId | null, UserWithId>> } - The user document if found, otherwise returns null.
         */
    async findUser(userRepoObject, key, includePassword = false) {
        return await userRepoObject.findUser(key, includePassword);
    }
    /**
     * @param {IUserRepository} userRepoObject  - User dependency injection
     * @param {string} userId - mongoose document id
     * @returns User object
     */
    async getUser(userRepoObject, userId) {
        return await userRepoObject.get(userId);
    }
    /**
         *Interface to find all users
         *
         * @param {IUserRepositiory}  userRepoObject - An instance of the User Class.
         * @returns {Promise<IUser | null>} - Returns user document if exists else return null
         */
    async findAllUsers(userRepoObject) {
        return await userRepoObject.findAllUsers();
    }
    /**
         * Interface to delete specific user
         *
         * @param {IUserRepository} userRepoObject - An instance of the User Class
         * @param { FilterQuery<IFindOption>} key - The criteria to identify the user to be deleted.
         * @returns {Promise<any>} - the deleted user document
         */
    async findUserAndDelete(userRepoObject, key) {
        return await userRepoObject.deleteUser(key);
    }
    /**
         * Interface to update the user address
         *
         * @param {IUserRepository} userRepoObject
         * @param {IAddress} fields
         * @returns mongoose user instance;
         */
    async updateAddress(userRepoObject, fields) {
        return await userRepoObject.updateAddress(fields.address, fields.userId, fields.addressId);
    }
    async addAddress(userRepoObject, fields) {
        return await userRepoObject.addAddress(fields.address, fields.userId);
    }
    async resetPassword(userRepoObject, fields) {
        return await userRepoObject.resetPassword(fields.email, fields.password);
    }
    async addForgotPasswordTokenID(userRepoObject, fields) {
        return await userRepoObject.addForgotTokenId(fields.email);
    }
    async updatePassword(userRepoObject, fields) {
        return await userRepoObject.changePassword(fields);
    }
    async fetchAddressByUserId(userRepoObject, fields) {
        return await userRepoObject.fetchAddresses(fields);
    }
    async deleteAddressById(userRepoObject, fields) {
        return await userRepoObject.deleteAddress(fields.addressId, fields.userId);
    }
    async updateUserProfile(userRepoObject, fields, userId) {
        return await userRepoObject.updateUserProfile(fields, userId);
    }
    async updateImageUrl(userRepoObject, fields, userId) {
        return await userRepoObject.setProfilePicture(fields, userId);
    }
    async deleteProfilePicture(userRepoObject, userId) {
        return await userRepoObject.deleteProfilePicture(userId);
    }
    async setEmailVerified(userRepoObject, user) {
        return userRepoObject.setEmailVerified(user);
    }
    async verifyPassword(userRepoObject, user, password) {
        return await userRepoObject.verifyPassword(user, password);
    }
    async getResetFormToken(userRepoObject, email) {
        return await userRepoObject.resetFormToken(email);
    }
    async getForgotPasswordToken(userRepoObject, id) {
        await userRepoObject.getForgotPasswordToken(id);
    }
    async setSeller(userRepoObject, userId) {
        return userRepoObject.setSeller(userId);
    }
}
exports.default = UserServices;
//# sourceMappingURL=user.services.js.map