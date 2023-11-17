import { type Query, type Document, type Types, type FilterQuery } from 'mongoose'
import { type imageUrl } from './cloudinary.interfaces'
export interface Address {
  fullname: string
  city: string
  homeAddress: string
  state: string
  postalCode: string
  phoneNo: string
  country: string
}
export interface IAddress extends Document {
  fullname: string
  city: string
  homeAddress: string
  state: string
  postalCode: string
  phoneNo: string
  country: string
}
export interface IUser extends Document {
  fullname: string
  username: string
  email: string
  password: string
  role: string
  photo: {
    id: string
    secure_url: string
    url: string
  }
  gender?: string
  address?: IAddress[]
  emailVerified: boolean

  forgotpasswordTokenVerfied?: boolean
  forgotPasswordTokenId?: string
  unVerifiedUserExpires: Date
  isPrimeUser: boolean
  verifyPassword: (password: string) => Promise<boolean>
}

/** @type any key:value pair exits in user schema */
export type UserParam = Record<string, string>

export type UserWithId = IUser & { _id: Types.ObjectId }
export interface IUserRepository {
  create: (fields: Record<string, unknown>) => Promise<IUser>
  findUser: (key: FilterQuery<UserParam>, includePassword: boolean) => Promise< Query<UserWithId | null, UserWithId >>
  findAllUsers: () => Promise< Query<UserWithId[] | null, UserWithId >>
  deleteUser: (key: FilterQuery<UserParam>) => Promise<UserWithId>
  addAddress: (address: IAddress, userId: FilterQuery<string>) => Promise<Query<UserWithId | null, UserWithId>>
  updateAddress: (address: IAddress, userId: FilterQuery<string>, addressId: string) => Promise<IAddress[] | null>
  resetPassword: (email: FilterQuery<string>, password: string) => Promise<UserWithId | null>
  addForgotTokenId: (email: FilterQuery<string>) => Promise<UserWithId | null>
  verifyPassword: (user: UserWithId, password: string) => Promise<any>
  changePassword: (fields: { id: FilterQuery<Record<string, string>>, currentPassword: string, newPassword: string }) => Promise<UserWithId | null | boolean>
  fetchAddresses: (userId: FilterQuery<string>) => Promise<Query<IAddress[] | null, IAddress>>
  deleteAddress: (fields: any) => Promise<IAddress[] | null>
  updateUserProfile: (fields: any, userId: string) => Promise<UserWithId | null>
  setProfilePicture: (fields: imageUrl, userId: string) => Promise<UserWithId | null>
  deleteProfilePicture: (userId: string) => Promise<UserWithId | null>
  setEmailVerified: (user: UserWithId) => any
}
