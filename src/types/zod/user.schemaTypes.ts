import mongoose from 'mongoose'
import z from 'zod'
const Countries = ['India'] as const
const Gender = ['Male', 'Female', 'Unisex'] as const
export const LoginSchema = z.object({
  email: z.string().email('Please provide valid email address').min(3, 'Please provide valid email address'),
  password: z.string().min(1, 'Please enter your password')
})

export const RegisterSchema = z.object({
  fullname: z
    .string()
    .min(3, 'fullname must be at least 2 characters')
    .max(255, 'fullanme can be at most 255 characters'),
  email: z
    .string()
    .email({ message: 'Please provide a valid email address' })
    .min(3, 'Email address must be at least 3 characters')
    .max(255, 'Email address can be at most 255 characters'),

  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters' })
    .max(100, { message: 'Password can be at most 100 characters' })
    .regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+{}|:;<>,.?~]+$/, 'Password must contain at least one letter and one number')
})

export const ForgotPasswordSchema = z.object({
  email: z
    .string()
    .email({ message: 'Please provide a valid email address' })
    .min(3, 'Email address must be at least 3 characters')
    .max(255, 'Email address can be at most 255 characters')
})

export const ResetPasswordSchema = z.object({
  token: z
    .string()
    .min(3, 'fullname must be at least 2 characters'),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters' })
    .max(100, { message: 'Password can be at most 100 characters' })
    .regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+{}|:;<>,.?~]+$/, 'Password must contain at least one letter and one number')
})

export const ChangePasswordSchema = z.object({
  currentPassword: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters' })
    .max(100, { message: 'Password can be at most 100 characters' })
    .regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+{}|:;<>,.?~]+$/, 'Password must contain at least one letter and one number'),
  newPassword: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters' })
    .max(100, { message: 'Password can be at most 100 characters' })
    .regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+{}|:;<>,.?~]+$/, 'Password must contain at least one letter and one number')
})

// This is for order object
export const AddresSchema = z.object({
  orderId: z.string().refine((id) => {
    if (mongoose.isValidObjectId(id)) {
      return true
    } else {
      return false
    }
  }, { message: 'Invalid product id' }),
  fullname: z.string().min(4),
  city: z.string().min(3),
  homeAddress: z.string().min(3),
  state: z.string().min(2),
  postalCode: z.number(),
  phoneNo: z.number().min(1),
  country: z.string()
})

// This is for user profile
export const AddressSchemaWithAddressId = z.object({
  addressId: z.string({
    required_error: 'address id must be provided',
    invalid_type_error: 'addressId must be a string'
  }).refine((id) => {
    if (mongoose.isValidObjectId(id)) {
      return true
    } else {
      return false
    }
  }, { message: 'Invalid address id' }),
  fullname: z.string({
    invalid_type_error: 'fullname must be a string'
  }).max(100, { message: 'Must be 100 or fewer characters' }).optional(),
  city: z.string({
    invalid_type_error: 'city must be a string'
  }).max(50, { message: 'Maximum 50 characters' }).optional(),
  homeAddress: z.string({
    invalid_type_error: 'address must be a string'
  }).max(200, { message: 'Maximum 100 characters' }).optional(),
  state: z.string({
    invalid_type_error: 'State must be a string'
  }).max(50, { message: 'Maximum 50 characters' }).optional(),
  postalCode: z.string({
    invalid_type_error: 'Postal Code must be a string'
  }).refine((postalCode) => {
    if (postalCode.length > 0) {
      return /^[1-9]{1}[0-9]{2}\s{0,1}[0-9]{3}$/.test(postalCode)
    }
    return true
  }, { message: 'Please provide a valid postal code' })
    .optional(),
  phoneNo: z.string({
    invalid_type_error: 'Phone number must be a string'
  }).refine((phoneNo) => {
    if (phoneNo.length > 0) {
      return /^[6-9]\d{9}$/.test(phoneNo)
    }
    return true
  }, { message: 'Please provide a valid mobile number' })
    .optional(),
  country: z.enum(Countries).optional()
})

export const UserAddressSchema = z.object({
  fullname: z.string({
    required_error: 'fullame is required',
    invalid_type_error: 'fullname must be a string'
  }).min(4, { message: 'Must be 4 or more characters long' }).max(100, { message: 'Must be 100 or fewer characters' }),
  city: z.string({
    required_error: 'city is required',
    invalid_type_error: 'city must be a string'
  }).min(3, { message: 'Minimum 3 characters' }).max(50, { message: 'Maximum 50 characters' }),
  homeAddress: z.string({
    required_error: 'address is required',
    invalid_type_error: 'address must be a string'
  }).min(10, { message: 'Minimum 10 characters' }).max(200, { message: 'Maximum 100 characters' }),
  state: z.string({
    required_error: 'State is required',
    invalid_type_error: 'State must be a string'
  }).min(3, { message: 'Minimum 3 characters' }).max(50, { message: 'Maximum 50 characters' }),
  postalCode: z.string({
    required_error: 'Postal Code is required',
    invalid_type_error: 'Postal Code must be a string'
  }).regex(/^[1-9]{1}[0-9]{2}\s{0,1}[0-9]{3}$/, { message: 'Please provide a valid postal code' }),
  phoneNo: z.string({
    required_error: 'Phone number is required',
    invalid_type_error: 'Phone number must be a string'
  }).regex(/^[6-9]\d{9}$/, { message: 'Please provide a valid mobile number' }),
  country: z.enum(Countries)
})

export const ParamsByIdSchema = z.object({
  id: z.string().min(1).refine((id) => {
    if (mongoose.isValidObjectId(id)) {
      return true
    } else {
      return false
    }
  }, {
    message: 'Invalid ObjectId'
  })
})

export const QueryWithTokenSchema = z.object({
  token: z.string().min(1)
})
export const UpdateProfileSchema = z.object({
  fullname: z.string().max(50, { message: 'Password must be at max 50 characters' }),
  gender: z.enum(Gender)
})
export const PhotoSchema = z.object({
  image: z.any({
    required_error: 'Please provide an image'
  })
})
export type ID = z.infer<typeof ParamsByIdSchema>
export type Login = z.infer<typeof LoginSchema>
export type Register = z.infer<typeof LoginSchema>
export type ForgotPassword = z.infer<typeof ForgotPasswordSchema>
export type ResetPassword = z.infer<typeof ResetPasswordSchema>
export type ChangePassword = z.infer<typeof ChangePasswordSchema>
export type AddressWithOrderId = z.infer<typeof AddresSchema>
export type AddressWithAddressId = z.infer<typeof AddressSchemaWithAddressId >
export type QueryWithToken = z.infer<typeof QueryWithTokenSchema>
export type UserAddress = z.infer<typeof UserAddressSchema>
export type UpdateProfile = z.infer<typeof UpdateProfileSchema>
export type Photo = z.infer<typeof PhotoSchema>
