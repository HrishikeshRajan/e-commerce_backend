import { Flat, Percentage } from "@controllers/cartController";
import mongoose, { Model, Types } from "mongoose";
import { ProductCore } from "types/product.interface";


export interface CartItemCore {
  product: mongoose.Types.ObjectId
  qty: number
  options: Options
  totalPrice: number
  totalPriceBeforeTax: number
  totalPriceAfterTax: number
  orderStatus: ORDER_STATUS
  gstInPercentage: number
  taxAmount: number
  discount?: {
    discountSourceId: mongoose.Types.ObjectId
    source: string
  }
  appliedOffer?:Percentage | Flat
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
  products: Record<string, CartItemCore>;
  grandTotalPrice: number;
  grandTotalQty: number;
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

export enum CART_STATUS {
 ACTIVE ='Active',
 EXPIRED = 'Expired'
}

export enum NumToStatusMap {
  "N" = ORDER_STATUS.NOT_PROCESSED,
  "P" = ORDER_STATUS.PROCESSING,
  "S" = ORDER_STATUS.SHIPPED,
  "C" = ORDER_STATUS.CANCELED,
  "D" = ORDER_STATUS.DELIVERED
}

export interface CartItemDocument extends mongoose.Document {
  product: mongoose.Types.ObjectId
  qty: number
  options: Options
  totalPrice: number
  totalPriceBeforeTax: number
  totalPriceAfterTax: number
  orderStatus: ORDER_STATUS
  gstInPercentage: number
  taxAmount: number
  discount?: {
    discountSourceId: mongoose.Types.ObjectId
    source: string
  },
  appliedOffer?:Percentage | Flat
};


export interface CartDocument extends mongoose.Document {
  userId: mongoose.Types.ObjectId;
  products: Map<string, CartItemDocument>;
  grandTotalPrice: number;
  grandTotalQty: number;
  createdAt?: string;
  updatedAt?: string;
  status:CART_STATUS.ACTIVE | CART_STATUS.EXPIRED
}

export type AppliedOffer = {
  type:'FLAT' | 'PERCENTAGE'
  originalAmount:number
  discountFixedAmount?: number
  discountPercentage?: number
  discountedPrice:number
  tax:number
  discountedPriceAftTax:number
  yourSavings:number
  couponId:string
  productId?:string
  promoCode: string
};

// Define schema for Cart
const cartItemSchema = new mongoose.Schema<CartItemDocument>({
  product: {
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
  discount: {
    discountSourceId: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'source',
    },
    source: {
      type: String,
      enum: ['FlashSale']
    }

  },
  appliedOffer:{
    type: {
      type: String,
      enum: ['FLAT', 'PERCENTAGE'],
    
    },
    originalAmount: {
      type: Number,

    },
    discountFixedAmount: {
      type: Number,

    },
    discountPercentage: {
      type: Number,

    },
    discountedPrice: {
      type: Number,

    },
    tax: {
      type: Number,

    },
    discountedPriceAftTax: {
      type: Number,

    },
    yourSavings: {
      type: Number,

    },
    couponId: {
      type: String,

    },
    productId: {
      type: String
    },
    promoCode: {
      type: String,
    }
  },

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
  grandTotalQty: Number,
  status:{
    type: String,
    enum:[CART_STATUS.ACTIVE, CART_STATUS.EXPIRED],
    default: CART_STATUS.ACTIVE
  }
}, { timestamps: true });

const CartModel = mongoose.model<CartDocument>('Cart', cartSchema);
cartSchema.post('save', function(doc) {
  if(Object.values(this.products).length < 1){
    
  }
});
export default CartModel;
