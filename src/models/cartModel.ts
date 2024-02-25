import mongoose, { Model, Types } from "mongoose";
import { ProductCore } from "types/product.interface";


export interface CartItemCore {
  productId: mongoose.Types.ObjectId
  qty: number
  options: Options
  totalPrice: number
  totalPriceBeforeTax: number
  totalPriceAfterTax: number
  orderStatus: ORDER_STATUS
  gstInPercentage: number
  taxAmount: number
};





export interface ResponseCart {
  userId: mongoose.Types.ObjectId
  products: { [x: string]: CartItemCore };
  grandTotalPrice?: number;
  grandTotalQty?: number;
  cartId: mongoose.Types.ObjectId
}

export interface PopulatedCartItem {
  userId: mongoose.Types.ObjectId;
  products: Map<string, CartItemCore>;
  grandTotalPrice?: number;
  grandTotalQty?: number;
}

export interface CartCore {
  userId: mongoose.Types.ObjectId;
  products: Map<string, CartItemDocument>;
  grandTotalPrice?: number;
  grandTotalQty?: number;
}

export interface Options {
  color: string
  size: string
}

export enum ORDER_STATUS {
  NOT_PROCESSED = 'Not_processed',
  PROCESSING = 'Processing',
  SHIPPED = 'Shipped',
  CANCELED = 'CANCELED',
  DELIVERED = 'Delivered'
}

export enum NumToStatusMap {
  "N" = ORDER_STATUS.NOT_PROCESSED,
  "P" = ORDER_STATUS.PROCESSING,
  "S" = ORDER_STATUS.SHIPPED,
  "C" = ORDER_STATUS.CANCELED,
  "D" = ORDER_STATUS.DELIVERED
}

export interface CartItemDocument extends mongoose.Document {
  productId: mongoose.Types.ObjectId
  qty: number
  options: Options
  totalPrice: number
  totalPriceBeforeTax: number
  totalPriceAfterTax: number
  totalPriceAfterTaxString: string
  orderStatus: ORDER_STATUS
  gstInPercentage: number
  taxAmount: number
};


export interface CartDocument extends mongoose.Document {
  userId: mongoose.Types.ObjectId;
  products: Map<string, CartItemDocument>;
  grandTotalPrice: number;
  grandTotalPriceString: String;
  grandTotalQty: number;
  createdAt?: string;
  updatedAt?: string
}

// Define schema for Cart
const cartItemSchema = new mongoose.Schema<CartItemDocument>({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    require: true
  },
  qty: Number,
  options: {
    color: {
      type: String,
      require: true
    },
    size: {
      type: String,
      require: true
    }
  },
  totalPrice: Number,
  orderStatus: {
    type: String,
    enum: [ORDER_STATUS.NOT_PROCESSED, ORDER_STATUS.PROCESSING, ORDER_STATUS.SHIPPED, ORDER_STATUS.DELIVERED, ORDER_STATUS.CANCELED],
    default: ORDER_STATUS.NOT_PROCESSED
  },
  gstInPercentage: {
    type: Number,
    enum: [5, 12]
  },
  taxAmount: Number,
  totalPriceBeforeTax: Number,
  totalPriceAfterTax: Number,
  totalPriceAfterTaxString: String,
});

//Cart have multiple products
const cartSchema = new mongoose.Schema<CartDocument, Model<CartDocument>>({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    require: true
  },
  products: {
    type: Map,
    of: cartItemSchema,
    default: {}
  },
  grandTotalPrice: Number,
  grandTotalPriceString: String,
  grandTotalQty: Number
}, { timestamps: true });

const CartModel = mongoose.model<CartDocument>('Cart', cartSchema);

export default CartModel;
