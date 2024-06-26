import { Schema, Model, Types, model, Document } from 'mongoose'

export interface CloudinaryImage { id: string, secure_url: string, url: string }
export interface ShopReview {
    userId: Types.ObjectId
    title: string,
    description: string,
    images: Types.DocumentArray<CloudinaryImage>,
    star: number
    date: Date
}

//The core type definition for shop
export interface ShopCore {
    _id:Types.ObjectId
    name: string
    logo: CloudinaryImage,
    description: string
    reviews: Types.DocumentArray<ShopReview>,
    address: Object
    updated: Date
    created: Date
    owner: Types.ObjectId
    email:string
    isActive:boolean
}
// Create a document type for ShopCore
export type ShopDocument = ShopCore & Document
 //The Model type provides the mongoose methods
const shopSchema = new Schema<ShopDocument, Model<ShopDocument>>(
    {
            name: {
                type: String,
                required: [true, 'Please provide product name'],
                trim: true
            },
            email: {
                type: String,
                trim: true,
                unique: true,
                lowercase: true,
                required: true
              },
            description: {
                type: String,
                required: [true, 'Please provide product description']
            },
            logo:
            {
                url: {
                    type: String
                },
                secure_url: {
                    type: String

                }
            },
            owner: {
                type: Schema.Types.ObjectId,
                ref: 'User',
                required: true
            },
            reviews: [{
                userId: { type: Types.ObjectId, ref: 'User', required: true },
                title: String,
                description: String,
                images: [{ id: String, secure_url: String, url: String }],
                star: { type: Number, min: 0, max: 5, default: 0 },
                date: { type: Date, default: Date.now }

            }],
            address:{
                type:String,
                require:true
            },
            updated: Date,
            created: {
                type: Date,
                default: Date.now
            },
            isActive:{
                type:Boolean,
                default:true
            }
    },
)



export default model<ShopDocument>('Shop', shopSchema)