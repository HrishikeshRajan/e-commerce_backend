import { type Query, type Document, type FilterQuery } from 'mongoose'
import { type IUserRepository, type IUser, type UserParam, type UserWithId, type IAddress } from '../types/IUser.interfaces'
import { type imageUrl } from '../types/cloudinary.interfaces'

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
  async createUser (userRepoObject: IUserRepository, fields: Record<string, unknown>): Promise<Document<IUser>> {
    return await userRepoObject.create(fields)
  }

  /**
       * Interface to find single user
       *
       * @param {IUserRepository} userRepoObject - An instance of the User class.
       * @param {FilterQuery<UserParam>} key - The field to search for the user.
       * @param {boolean} [includePassword=false] - Specify includePassword = true to include the password in the result.
       * @returns { Promise<Query<UserWithId | null, UserWithId>> } - The user document if found, otherwise returns null.
       */
  async findUser (userRepoObject: IUserRepository, key: FilterQuery<UserParam>, includePassword: boolean = false): Promise<Query<UserWithId | null, UserWithId>> {
    return await userRepoObject.findUser(key, includePassword)
  }

  /**
       *Interface to find all users
       *
       * @param {IUserRepositiory}  userRepoObject - An instance of the User Class.
       * @returns {Promise<IUser | null>} - Returns user document if exists else return null
       */
  async findAllUsers (userRepoObject: IUserRepository): Promise<Query<UserWithId[] | null, UserWithId >> {
    return await userRepoObject.findAllUsers()
  }

  /**
       * Interface to delete specific user
       *
       * @param {IUserRepository} userRepoObject - An instance of the User Class
       * @param { FilterQuery<IFindOption>} key - The criteria to identify the user to be deleted.
       * @returns {Promise<any>} - the deleted user document
       */
  async findUserAndDelete (userRepoObject: IUserRepository, key: UserParam): Promise<any> {
    return await userRepoObject.deleteUser(key)
  }

  /**
       * Interface to update the user address
       *
       * @param {IUserRepository} userRepoObject
       * @param {IAddress} fields
       * @returns mongoose user instance;
       */

  async updateAddress (userRepoObject: IUserRepository, fields: any): Promise<IAddress[] | null> {
    return await userRepoObject.updateAddress(fields.address, fields.userId, fields.addressId)
  }

  async addAddress (userRepoObject: IUserRepository, fields: any): Promise<UserWithId | null> {
    return await userRepoObject.addAddress(fields.address, fields.userId)
  }

  async resetPassword (userRepoObject: IUserRepository, fields: any): Promise<UserWithId | null> {
    return await userRepoObject.resetPassword(fields.email, fields.password)
  }

  async addForgotPasswordTokenID (userRepoObject: IUserRepository, fields: any): Promise<UserWithId | null> {
    return await userRepoObject.addForgotTokenId(fields.email)
  }

  async updatePassword (userRepoObject: IUserRepository, fields: any): Promise<UserWithId | null | boolean> {
    return await userRepoObject.changePassword(fields)
  }

  async fetchAddressByUserId (userRepoObject: IUserRepository, fields: FilterQuery<string>): Promise<IAddress[] | null > {
    return await userRepoObject.fetchAddresses(fields)
  }

  async deleteAddressByAddressId (userRepoObject: IUserRepository, fields: FilterQuery<Record<string, string>>): Promise<IAddress[] | null > {
    return await userRepoObject.deleteAddress(fields)
  }

  async updateUserProfile (userRepoObject: IUserRepository, fields: FilterQuery<Record<string, string>>, userId: string): Promise<UserWithId | null > {
    return await userRepoObject.updateUserProfile(fields, userId)
  }

  async updateImageUrl (userRepoObject: IUserRepository, fields: imageUrl, userId: string): Promise<UserWithId | null > {
    return await userRepoObject.setProfilePicture(fields, userId)
  }

  async deleteProfilePicture (userRepoObject: IUserRepository, userId: string): Promise<UserWithId | null > {
    return await userRepoObject.deleteProfilePicture(userId)
  }

  async setEmailVerified (userRepoObject: IUserRepository, user: UserWithId): Promise<any> {
    return userRepoObject.setEmailVerified(user)
  }

  async verifyPassword (userRepoObject: IUserRepository, user: UserWithId, password: string): Promise<any> {
    return await userRepoObject.verifyPassword(user, password)
  }
}

export default UserServices
