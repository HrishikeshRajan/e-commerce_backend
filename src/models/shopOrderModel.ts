import mongoose, { Schema } from "mongoose"

const shopOrderSchema = new Schema (
    {
            shopId: {
                type: mongoose.Schema.Types.ObjectId,
                ref:'Shop',
                required: true
            },
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                ref:'User'
            },
            product:{}
    },
)



export default model('ShopOrder', shopOrderSchema)