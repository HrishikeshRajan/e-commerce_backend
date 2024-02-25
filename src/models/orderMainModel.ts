import mongoose, { Types } from "mongoose";
import { Address } from "types/IUser.interfaces";
import { ProductCore } from "types/product.interface";
import { CartDocument, CartItemCore, CartItemDocument } from "./cartModel";
export enum ORDER_STATUS {
  PENDING = 'PENDING',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
  CANCELED = 'CANCELED',
  ACTIVE = 'ACTIVE'
}

export enum PAYMENT_STATUS {
  PENDING = 'PENDING',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
  INITIATED = 'INITIATED'
}
export interface Options {
  color: string
  size: string
}
export interface OrderItemCore {
  product: any
  qty: number
  totalPrice: number
  options: Options
};
export interface OrderItemDocument extends mongoose.Document {
  productId: string
  qty: number
  totalPrice: number
  options: Options
};

// Define schema for Cart
const orderItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    require: true
  },
  qty: Number,
  totalPrice: Number,
  options: {
    color: {
      type: String,
      require: true
    },
    size: {
      type: String,
      require: true
    }
  }
});


export interface ResponseOrder {
  userId: mongoose.Types.ObjectId
  cartId:mongoose.Types.ObjectId
  orderId:mongoose.Types.ObjectId
  shippingAddress:{}
  paymentDetails:{}
  grandTotalPrice: number;
  grandTotalQty: number;
  orderStatus:string
  deliveryDetails:{
    status:boolean
    deliveryId:mongoose.Types.ObjectId
  }
}



export interface PaymentDetails{
  status:string
  paymentId:string
  paidAmount:number
}
export interface OrderDetails{
  status:string
  fullfiled:string,
}
export interface OrderCore {
  userId: mongoose.Types.ObjectId;
  cartId:mongoose.Types.ObjectId
  shippingAddress?:Address
  paymentDetails?:PaymentDetails
  orderDetails:OrderDetails
}

export interface OrderDocument extends mongoose.Document {
  userId: mongoose.Types.ObjectId
  cartId:mongoose.Types.ObjectId
  product:CartItemDocument
  shippingAddress:Address
  paymentDetails:PaymentDetails
  orderDetails:OrderDetails
}



const orderMainSchema = new mongoose.Schema<OrderDocument>({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    require: true
  },
  cartId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Cart",
    require: true
  },
  product:{

  },
  shippingAddress: {   
     fullname: {
    type: String

  },
  city: {
    type: String

  },
  homeAddress: {
    type: String

  },
  state: {
    type: String

  },
  postalCode: {
    type: Number

  },
  phoneNo: {
    type: Number

  },
  country: {
    type: String

  }},
  paymentDetails: {
    status: {
      type: String,
      enum: [PAYMENT_STATUS.PENDING, PAYMENT_STATUS.SUCCESS, PAYMENT_STATUS.FAILED, PAYMENT_STATUS.INITIATED],
      default: ORDER_STATUS.PENDING,
      trim: true
    },
    paidAmount:Number,
    paymentId:String
  },
  orderDetails:{
    status: {
      type: String,
      enum: [ORDER_STATUS.PENDING, ORDER_STATUS.SUCCESS, ORDER_STATUS.FAILED, ORDER_STATUS.CANCELED],
      default: ORDER_STATUS.PENDING,
      trim: true
    },
    fullfilled:{
      type:String
    }
  },
}, { timestamps: true });

const OrderMainModel = mongoose.model<OrderDocument>('OrderMain', orderMainSchema);

export default OrderMainModel;
