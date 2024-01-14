import { Schema, Model, Types, model, Document } from 'mongoose'


//The core type definition for category
export interface CategoryCore {
    _id: Types.ObjectId
    name: string
    image: {
        secure_url: string
    },
    description: string
    updated: Date
    created: Date
}
// Create a document type for CategoryCore
export type CategoryDocument = CategoryCore & Document
//The Model type provides the mongoose methods
const categorySchema = new Schema<CategoryDocument, Model<CategoryDocument>>(
    {
        name: {
            type: String,
            required: [true, 'Please provide product name'],
            trim:   true
        },
        description: {
            type: String,
            required: [true, 'Please provide product description']
        },
        image:
        {

            secure_url: {
                type: String

            }
        },

        created: {
            type: Date,
            default: Date.now
        }
    },
)



export default model<CategoryDocument>('Category', categorySchema)