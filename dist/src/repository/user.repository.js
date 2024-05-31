"use strict";
/* eslint-disable @typescript-eslint/explicit-function-return-type */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const userModel_1 = __importDefault(require("../models/userModel"));
const uuid_1 = require("uuid");
const crypto = __importStar(require("crypto"));
class UserRepository {
    userSchema;
    constructor() {
        this.userSchema = userModel_1.default;
    }
    //New APIS
    /**
     * Returns user as plain javascript Object
     * @param userId
     * @returns user object
     */
    async get(userId) {
        const user = await this.userSchema.findById(userId);
        return user ? user.toObject() : null;
    }
    /**
     * Updates both seller and role property
     * @param {string} userId
     * @returns
     */
    async setSeller(userId) {
        const user = await this.findUser({ _id: userId });
        if (!user)
            return null;
        user.seller = !user.seller;
        user.role = user.seller ? 'seller' : 'user';
        const userDocument = await user.save();
        return userDocument.toObject();
    }
    /**
       * Deletes the user document
       *
       * @param {UserParam} param  - The user document will be deleted based on the param
       * @returns {Promise<UserWithId>} - plain javacript object of deleted user document
       * @throws - Mongoose error if occur
       */
    async deleteUser(param) {
        const result = await this.userSchema.findOneAndDelete(param).lean();
        return result;
    }
    async setEmailVerified(user) {
        user.emailVerified = true;
        await this.saveToDatabase(user);
    }
    async convertToUserObject(user) {
        return await user.toObject();
    }
    /**
       * Finds user based on param
       *
       * @param {Object} key - Document is searched based on this key
       * @param {Boolean} includePassword - Set to true if you want document with password field
       * @returns { Promise< Query<UserWithId | null, UserWithId >>>} - The user if exists else return null.
       * @throws {CustomError} - Throws http error if any failure occurs
       */
    async findUser(key, includePassword = false) {
        let user;
        if (includePassword) {
            user = await this.userSchema.findOne(key, '+password');
        }
        else {
            user = await this.userSchema.findOne(key);
        }
        return user;
    }
    /**
         * Finds all the users
         *
         * @returns {Promise<Array<IUser> | null>} - The user if exists else return null.
         * @throws {CustomError} - Throws http error if any failure occurs
         */
    async findAllUsers() {
        const users = await this.userSchema.find({});
        return users;
    }
    /**
         * create a new user document
         * @param {Record<string, unknown>} fields - user inputs that allowed in the user schema
         * @returns {Promise<IUser>} - a promise of created user document
         * @throws - mongoose Error
         */
    async create(fields) {
        const user = await this.userSchema.create(fields);
        return user;
    }
    /**
     *
     * @param {IAddress} address - Addresss fields
     * @param {string} userId
     * @returns - user document
     */
    async addAddress(address, userId) {
        const user = await this.findUser({ userId });
        if (user === null)
            return null;
        user.address?.push(address);
        const result = await this.saveToDatabase(user);
        return result;
    }
    ;
    async fetchAddresses(userId) {
        const user = await this.findUser({ _id: userId });
        if (user === null)
            return null;
        return user.address ?? null;
    }
    /**
       * Update the user document fields in database.     *
       * @param {UserWithId} mongooseObj
       */
    async saveToDatabase(mongooseObj) {
        const result = await mongooseObj.save();
        return result;
    }
    /**
     * Assigns the user document with new address fileds
     *
     * @param {UserWithId} data
     * @param {string} addressId
     * @param {IAddress} newAddress
     * @returns modified mongoose user instance
     */
    updateAddressHelper(user, addressId, newAddress) {
        const index = user?.address?.findIndex((address) => (address._id.toString() === addressId.toString()));
        if (index !== undefined && index > -1 && user.address) {
            user.address[index] = newAddress;
        }
        return user;
    }
    ;
    /**
       *Updates the new fields with existing document
       *
       * @param {IAddress} newAddress
       * @param userId
       * @param addressId
       * @returns user with id field
       */
    async updateAddress(newAddress, userId, addressId) {
        const user = await this.findUser({ _id: userId });
        if (user === null)
            return null;
        const updatedUser = this.updateAddressHelper(user, addressId, newAddress);
        await this.saveToDatabase(updatedUser);
        return undefined;
    }
    ;
    async resetPassword(email, password) {
        const user = await this.findUser({ email }, true);
        if (user === null)
            return null;
        user.password = password;
        const result = await this.saveToDatabase(user);
        return result;
    }
    calculateExpiry() {
        return JSON.stringify(Date.now() + (1 * 60 * 1000));
    }
    async addForgotTokenId(email) {
        const user = await this.findUser({ email });
        if (user === null)
            return null;
        const id = (0, uuid_1.v4)();
        user.forgotPasswordTokenId = id;
        const result = await this.saveToDatabase(user);
        return result;
    }
    async resetFormToken(email) {
        const user = await this.findUser({ email });
        if (user == null)
            return;
        const forgotToken = crypto.randomBytes(20).toString('hex');
        const hash = crypto.createHash('sha256').update(JSON.stringify(forgotToken)).digest('hex');
        user.forgotPasswordTokenId = hash;
        user.forgotPasswordTokenExpiry = this.calculateExpiry();
        await this.saveToDatabase(user);
        return forgotToken;
    }
    async verifyPassword(user, password) {
        const result = await user.verifyPassword(password);
        return result;
    }
    async changePassword(fields) {
        const user = await this.findUser({ _id: fields.id }, true);
        if (user === null)
            return null;
        const isUser = await this.verifyPassword(user, fields.currentPassword);
        if (!isUser)
            return false;
        user.password = fields.newPassword;
        const result = await this.saveToDatabase(user);
        return result;
    }
    async deleteAddress(addressId, userId) {
        let user = await this.findUser({ _id: userId });
        if (user === null)
            return null;
        const index = user?.address?.findIndex((address) => address._id.toString() === addressId.toString());
        if (index !== undefined && index > -1) {
            user.address?.splice(index, 1);
        }
        const result = await this.saveToDatabase(user);
        return result ?? null;
    }
    async updateUserProfile(fields, userId) {
        const user = await this.findUser({ _id: userId });
        if (user === null)
            return null;
        user.fullname = fields.fullname;
        user.username = fields.username;
        user.gender = fields.gender;
        const result = await this.saveToDatabase(user);
        return result;
    }
    async setProfilePicture(fields, userId) {
        const user = await this.findUser({ _id: userId });
        if (user === null)
            return null;
        user.photo.id = fields.publicId;
        user.photo.secure_url = fields.secureUrl;
        user.photo.url = fields.url;
        const result = await this.saveToDatabase(user);
        return result;
    }
    async deleteProfilePicture(userId) {
        const user = await this.findUser({ _id: userId });
        if (user === null)
            return null;
        user.photo.id = '';
        user.photo.secure_url = '';
        user.photo.url = '';
        const result = await this.saveToDatabase(user);
        return result;
    }
    #createHash(id) {
        return crypto.createHash('sha256').update(JSON.stringify(id)).digest('hex');
    }
    async getForgotPasswordToken(id) {
        const hash = this.#createHash(id);
        const result = await this.userSchema.findOne({
            forgotPasswordTokenId: hash,
            forgotPasswordTokenExpiry: {
                $gt: JSON.stringify(Date.now())
            }
        });
        return result;
    }
}
exports.default = UserRepository;
//# sourceMappingURL=user.repository.js.map