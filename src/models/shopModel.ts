import mongoose, { Schema, model } from 'mongoose'

const shopModel: Schema = new Schema({
  name: {
    type: String,
    maxlength: [40, 'fullname must be less than 40 characters']
  },
  tagline: {
    type: String,
    maxlength: [50, 'username must be less than 40 characters']
  },
  description: {
    type: String
  },
  email: {
    type: String,
    trim: true,
    unique: true,
    lowercase: true,
    required: true
  },
  address: {
    type: String
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  logo: {
    data: Buffer,
    type: String
  }
},
{
  timestamps: true
})

export default model('Shop', shopModel)
