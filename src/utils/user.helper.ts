import { UserCore, type UserWithId } from '../types/IUser.interfaces'
import { type Request } from "express"
export const responseFilter = (user: UserWithId): any => {
  const newUser = { ...user } as any
  delete newUser.password
  delete newUser.forgotPasswordTokenId
  delete newUser.forgotpasswordTokenVerfied
  delete newUser.unVerifiedUserExpires
  delete newUser.createdAt
  delete newUser.updatedAt
  return newUser
}

export const userFilter = (user: UserCore): UserCore => {
  const newUser = { ...user } as any
  newUser._id = newUser._id.toString()
  delete newUser.password
  delete newUser.forgotPasswordTokenId
  delete newUser.forgotpasswordTokenVerfied
  delete newUser.unVerifiedUserExpires
  delete newUser.createdAt
  delete newUser.updatedAt
  delete newUser.__v
  delete newUser.forgotPasswordTokenExpiry
  return newUser
}


export const getUserId = (req: Request) => req.user?.id || null