import { type UserWithId } from '../types/IUser.interfaces'

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
