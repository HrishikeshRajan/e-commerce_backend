import { Schema, model } from 'mongoose'
import { type IUser } from '../types/IUser.interfaces'
import bcrypt from 'bcryptjs'

const userModel: Schema = new Schema<IUser>({
  fullname: {
    type: String,
    maxlength: [40, 'fullname must be less than 40 characters']
  },
  username: {
    type: String,
    maxlength: [40, 'username must be less than 40 characters']
  },
  email: {
    type: String,
    trim: true,
    unique: true,
    lowercase: true,
    required: true
  },
  password: {
    type: String,
    required: [true, 'Please provied a password'],
    minlength: [6, 'Password should have minimum 6 characters ']
    // select: false,
  },
  role: {
    type: String,
    default: 'user'
  },
  photo: {
    id: {
      type: String
    },
    secure_url: {
      type: String
    },
    url: {
      type: String
    }
  },
  gender: {
    type: String,
  },
  address: [
    {
      fullname: {
        type: String,
        required: true
      },
      city: {
        type: String,
        required: true
      },
      homeAddress: {
        type: String,
        required: true
      },
      state: {
        type: String,
        required: true
      },
      postalCode: {
        type: String,
        required: true
      },
      phoneNo: {
        type: String,
        required: true
      },
      country: {
        type: String,
        required: true
      },
      isPrimary: {
        type: Boolean,
        default: false
      },
      isDefault: {
        type: Boolean,
        default: false
      }
    }
  ],
  emailVerified: {
    type: Boolean,
    default: false
  },

  forgotpasswordTokenVerfied: {
    type: Boolean,
    default: false
  },
  forgotPasswordTokenId: String,
  forgotPasswordTokenExpiry: String,
  unVerifiedUserExpires: {
    type: Date,
    default: () => new Date(+new Date() + 10 * 60 * 1000)
  },
  isPrimeUser: {
    type: Boolean,
    default: false
  },
  seller: {
    type: Boolean,
    default: false
  }
},
{
  timestamps: true
})

userModel.index(
  { unVerifiedUserExpires: 1 },
  {
    expireAfterSeconds: 0,
    partialFilterExpression: { emailVerified: false }
  }
)

userModel.pre<IUser>(/^save$/, async function (next): Promise<void> {
  if (!this.isModified('password')) { next(); return }
  this.password = await bcrypt.hash(this.password, 10)
})

userModel.methods.verifyPassword = async function (password: string): Promise<boolean> {
  const user = this as IUser
  const result = await bcrypt.compare(password, user.password)
  return result
}


export default model<IUser>('User', userModel)
