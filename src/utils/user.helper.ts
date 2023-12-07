import { UserCore, type UserWithId } from '../types/IUser.interfaces'

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

export const userFilter = (user: any) => {
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
