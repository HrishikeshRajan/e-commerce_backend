/* eslint-disable @typescript-eslint/explicit-function-return-type */

/**
 * User Class
 * @author Hrishikesh rajan // https://github.com/HrishikeshRajan
 *
 */

import { type IUserRepository, type IUser, type UserParam, type IAddress, type UserWithId, UserCore } from '../types/IUser.interfaces'
import User from '../models/userModel'
import { type Query, type FilterQuery } from 'mongoose'
import { v4 as uuidv4 } from 'uuid'
import { type imageUrl } from '../types/cloudinary.interfaces'
import * as crypto from 'crypto';
class UserRepository implements IUserRepository {
  private readonly userSchema: typeof User
  constructor() {
    this.userSchema = User
  }

  //New APIS

  /**
   * Returns user as plain javascript Object
   * @param userId 
   * @returns user object
   */
  async get(userId: string): Promise<any> {
    const user = await this.userSchema.findById(userId);
    return user ? user.toObject() : null;
  }
  /**
   * Updates both seller and role property
   * @param {string} userId 
   * @returns 
   */
  async setSeller(userId: string): Promise<UserCore | null> {
    const user = await this.findUser({ _id: userId })
    if (!user) return null
    user.seller = !user.seller
    user.role = user.seller ? 'seller' : 'user'
    const userDocument = await user.save();
    return userDocument.toObject()
  }


  /**
     * Deletes the user document
     *
     * @param {UserParam} param  - The user document will be deleted based on the param
     * @returns {Promise<UserWithId>} - plain javacript object of deleted user document
     * @throws - Mongoose error if occur
     */
  async deleteUser(param: FilterQuery<UserParam>): Promise<UserWithId> {
    const result = await this.userSchema.findOneAndDelete(param).lean()
    return result
  }

  async setEmailVerified(user: UserWithId): Promise<any> {
    user.emailVerified = true
    await this.saveToDatabase(user)
  }

  async convertToUserObject(user: UserWithId): Promise<UserWithId> {
    return await user.toObject()
  }
  /**
     * Finds user based on param
     *
     * @param {Object} key - Document is searched based on this key
     * @param {Boolean} includePassword - Set to true if you want document with password field
     * @returns { Promise< Query<UserWithId | null, UserWithId >>>} - The user if exists else return null.
     * @throws {CustomError} - Throws http error if any failure occurs
     */
  async findUser(key: FilterQuery<UserParam>, includePassword: boolean = false): Promise<Query<UserWithId | null, UserWithId>> {
    let user: UserWithId | null

    if (includePassword) {
      user = await this.userSchema.findOne(key, '+password')
    } else {
      user = await this.userSchema.findOne(key)
    }
    return user
  }

  /**
       * Finds all the users
       *
       * @returns {Promise<Array<IUser> | null>} - The user if exists else return null.
       * @throws {CustomError} - Throws http error if any failure occurs
       */
  async findAllUsers(): Promise<Query<UserWithId[] | null, UserWithId>> {
    const users = await this.userSchema.find({})
    return users
  }

  /**
       * create a new user document
       * @param {Record<string, unknown>} fields - user inputs that allowed in the user schema
       * @returns {Promise<IUser>} - a promise of created user document
       * @throws - mongoose Error
       */
  async create(fields: Record<string, unknown>): Promise<IUser> {
    const user = await this.userSchema.create(fields)
    return user
  }

  /**
   *
   * @param {IAddress} address - Addresss fields
   * @param {string} userId
   * @returns - user document
   */
  async addAddress(address: IAddress, userId: FilterQuery<string>): Promise<Query<UserWithId | null, UserWithId>> {
    const user = await this.findUser({ userId })
    if (user === null) return null
    user.address?.push(address)
    const result = await this.saveToDatabase(user)
    return result
  };

  async fetchAddresses(userId: FilterQuery<string>): Promise<Query<IAddress[] | null, IAddress>> {
    const user = await this.findUser({ _id: userId })
    if (user === null) return null
    return user.address ?? null
  }

  /**
     * Update the user document fields in database.     *
     * @param {UserWithId} mongooseObj
     */
  async saveToDatabase(mongooseObj: UserWithId): Promise<UserWithId> {
    const result = await mongooseObj.save()
    return result
  }

  /**
   * Assigns the user document with new address fileds
   *
   * @param {UserWithId} data
   * @param {string} addressId
   * @param {IAddress} newAddress
   * @returns modified mongoose user instance
   */

  updateAddressHelper(user: UserWithId, addressId: string, newAddress: IAddress): UserWithId {
   const index = user?.address?.findIndex((address: IAddress) => (address._id.toString() === addressId.toString()))
   if (index !== undefined && index > -1 &&  user.address) {
      user.address[index] = newAddress
    }
    return user
  };

  /**
     *Updates the new fields with existing document
     *
     * @param {IAddress} newAddress
     * @param userId
     * @param addressId
     * @returns user with id field
     */
  async updateAddress(newAddress: IAddress, userId: string, addressId: string) {
    const user = await this.findUser({ _id: userId })
    if (user === null) return null
    const updatedUser = this.updateAddressHelper(user, addressId, newAddress)
     await this.saveToDatabase(updatedUser)
    return undefined
  };

  async resetPassword(email: FilterQuery<Record<string, string>>, password: string): Promise<UserWithId | null> {
    const user = await this.findUser({ email }, true)
    if (user === null) return null
    user.password = password
    const result = await this.saveToDatabase(user)
    return result
  }

  private calculateExpiry() {
    return JSON.stringify(Date.now() + (1 * 60 * 1000))
  }

  async addForgotTokenId(email: FilterQuery<string>): Promise<UserWithId | null> {
    const user = await this.findUser({ email })
    if (user === null) return null

    const id = uuidv4()

    user.forgotPasswordTokenId = id
    const result = await this.saveToDatabase(user)
    return result
  }

  async resetFormToken(email: string) {
    const user = await this.findUser({ email })
    if (user == null) return
    const forgotToken = crypto.randomBytes(20).toString('hex');
    const hash = crypto.createHash('sha256').update(JSON.stringify(forgotToken)).digest('hex')
    user.forgotPasswordTokenId = hash
    user.forgotPasswordTokenExpiry = this.calculateExpiry()
    await this.saveToDatabase(user)
    return forgotToken
  }

  async verifyPassword(user: UserWithId, password: string): Promise<any> {
    const result = await user.verifyPassword(password)
    return result
  }

  async changePassword(fields: { id: FilterQuery<Record<string, string>>, currentPassword: string, newPassword: string }): Promise<UserWithId | null | boolean> {
    const user = await this.findUser({ _id: fields.id }, true)

    if (user === null) return null
    const isUser = await this.verifyPassword(user, fields.currentPassword)

    if (!isUser) return false
    user.password = fields.newPassword

    const result = await this.saveToDatabase(user)
    return result
  }

  async deleteAddress(addressId: string, userId: string) {
    let user = await this.findUser({ _id: userId })
    if (user === null) return null

    const index = user?.address?.findIndex((address) => address._id.toString() === addressId.toString())

   if(index !== undefined && index > -1 ){
    user.address?.splice(index,1)
   }
    const result = await this.saveToDatabase(user)

    return result ?? null
  }

  async updateUserProfile(fields: any, userId: string): Promise<UserWithId | null> {
    const user = await this.findUser({ _id: userId })
    if (user === null) return null
    user.fullname = fields.fullname
    user.username = fields.username
    user.gender = fields.gender
    const result = await this.saveToDatabase(user)
    return result
  }

  async setProfilePicture(fields: imageUrl, userId: string): Promise<UserWithId | null> {
    const user = await this.findUser({ _id: userId })
    if (user === null) return null

    user.photo.id = fields.publicId
    user.photo.secure_url = fields.secureUrl
    user.photo.url = fields.url
    const result = await this.saveToDatabase(user)
    return result
  }

  async deleteProfilePicture(userId: string): Promise<UserWithId | null> {
    const user = await this.findUser({ _id: userId })
    if (user === null) return null
    user.photo.id = ''
    user.photo.secure_url = ''
    user.photo.url = ''
    const result = await this.saveToDatabase(user)
    return result
  }

  #createHash(id: string) {
    return crypto.createHash('sha256').update(JSON.stringify(id)).digest('hex')
  }
  async getForgotPasswordToken(id: string) {
    const hash = this.#createHash(id)
    const result = await this.userSchema.findOne({
      forgotPasswordTokenId: hash,
      forgotPasswordTokenExpiry: {
        $gt: JSON.stringify(Date.now())
      }

    })
    return result;
  }
}

export default UserRepository


