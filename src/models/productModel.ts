import mongoose from 'mongoose'
import { type Product } from '../types/product'

const productSchema = new mongoose.Schema<Product>(
  {
    name: {
      type: String,
      required: [true, 'Please provide product name'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Please provide product description']
    },
    category: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: [true, 'Please provide product price'],
      maxlength: [6, 'Product price should not exceed 6 digits']
    },
    currencyCode: {
      type: String,
      required: [true, 'Please provide product price'],
      uppercase: true,
      enum: ['INR']
    },
    brand: {
      type: String,
      required: [true, 'Please provide product brand']
    },
    color: {
      type: String,
      required: true
    },
    sizes: [{ type: String }],

    photo:
    {
      url: {
        type: String
      },
      secure_url: {
        type: String

      }
    },
    photos: [
      {
        url: {
          type: String,
          required: true
        },
        secure_url: {
          type: String,
          required: true
        }
      }
    ],
    ratings: {
      type: Number,
      default: 0
    },
    numberOfReviews: {
      type: Number,
      default: 0
    },
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    reviews: [{
      userId: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
      title: { type: String },
      description: { type: String },
      star: { type: Number, min: 0, max: 5, default: 0 },
      date: { type: Date, default: Date.now }

    }],
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Unisex'],
      default: null,
      required: true
    },
    isDiscontinued: {
      type: Boolean,
      default: false
    },
    keywords: [String]
  },

  {
    timestamps: true
  }
)
productSchema.pre<Product>(/^save$/, async function (next): Promise<void> {
  if (!this.isModified('name')) {
    next(); return
  }

  this.name = this.name.split(' ').map((item) => item.charAt(0).toUpperCase() + item.slice(1)).join(' ')
  if (!this.isModified('category')) {
    next(); return
  }
  this.category = this.name.split(' ').map((item) => item.charAt(0).toUpperCase() + item.slice(1)).join(' ')
  if (!this.isModified('brand')) {
    next(); return
  }
  this.brand = this.name.split(' ').map((item) => item.charAt(0).toUpperCase() + item.slice(1)).join(' ')
})

export default mongoose.model<Product>('Product', productSchema)
