import mongoose, { Types } from "mongoose";
import { ProductCore } from "types/product.interface";

export interface Options {
  color: string
  size: string
}
export interface CartItemCore {
  product: any
  qty: number
  totalPrice: number
  options: Options
};
export interface CartItemDocument extends mongoose.Document {
  productId: string
  qty: number
  totalPrice: number
  options: Options
};
// export type Cart = {
//   userId: Types.ObjectId
//   products:{ [x:string]:Item }
//   grandTotalPrice:number
//   grandTotalQty:number
// };

// Define schema for Cart
const cartItemSchema = new mongoose.Schema({
  productId: {
    type:mongoose.Schema.Types.ObjectId,
    ref:'Product',
    require:true
  },
  qty: Number,
  totalPrice: Number,
  options: {
    color: {
        type:String,
        require:true
    },
    size: {
        type:String,
        require:true
    }
  }
});


export interface ResponseCart {
  userId: mongoose.Types.ObjectId
  products: {[x:string]: CartItemCore};
  grandTotalPrice?: number;
  grandTotalQty?: number;
  cartId:mongoose.Types.ObjectId
}
export interface CartCore {
  userId: mongoose.Types.ObjectId;
  products: Map<string, CartItemDocument>;
  grandTotalPrice?: number;
  grandTotalQty?: number;
}

export interface CartDocument extends mongoose.Document {
  userId: mongoose.Types.ObjectId;
  products: Map<string, CartItemDocument>;
  grandTotalPrice?: number;
  grandTotalQty?: number;
}



const cartSchema = new mongoose.Schema<CartDocument>({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        require:true
    },
  products: {
    type: Map,
    of: cartItemSchema,
    default: {}
  },
  grandTotalPrice: Number,
  grandTotalQty: Number
},{timestamps:true});

const CartModel = mongoose.model<CartDocument>('Cart', cartSchema);

export default CartModel;
