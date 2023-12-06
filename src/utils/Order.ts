// import { SessionData } from "express-session";
// // import { mongooseID } from "../repository/Cart";
// import { Request } from 'express';
// import mongoose from "mongoose";
// import { CART_ITEM } from "@/types/product";
// // import { Cart } from "../types";
// type mongooseID = mongoose.Types.ObjectId;
// export interface ITEM {
//     productId: mongooseID;
//     qty: number;
//     userId: mongooseID
//     subTotal?:number;
// }

// export type mobile_no = {
//     mob_no: number;
//     countryCode: `+${number}`;
// }

// export type Price = {
//     price: number;
//     currency: string;
// }

// export type Coupon = {
//     name: string;
//     description: string;
//     code: string;
//     discount: string;
//     discountModel: 'string';
//     createdAt: Date;
//     updatedAt: Date;
//     expiresAt: Date;
//     isActive: boolean;
// }


// export type GiftBox = {
//     name: string;
//     message: string;
//     isChecked: boolean;
// }

// export type DiscountPercentage = {
//     percentage: number;
//     symbol: '%';
// }
// export interface IAddress {
//     firstname: string;
//     lastname: string;
//     addressline_1: string;
//     zipCode: number;
//     city: number;
//     state: string;
//     mobileNumber: mobile_no;
//     email: string;
// }

// export interface Payment {
//     type: string;
//     isSuccess: boolean;
// }

// // export interface ICart {
// //     cart: Array<IProduct>;
// //     billingAddress: IAddress | undefined;
// //     shippingAddress: IAddress | undefined;
// //     totalPrice: Price | undefined;
// //     discountPercentage: DiscountPercentage | undefined;
// //     priceAfterDiscount: Price | undefined;
// //     payment: Payment | undefined;


// //     giftBox: GiftBox | undefined;
// //     coupon: Coupon | undefined;
// // }



// export class CartBuilder {
//     #products: Array<CART_ITEM>;
//     #totalPrice: number | undefined;
//     #totalQuantity: number | undefined;


//     constructor(session :Request) {

//      if(session && session.session){
//         if(session.session.cart as CART){
//             this.#products = [(session.session.cart as CART)];
//         }
//      }
//         this.#products = [];
       
//         this.#totalPrice = 0;
//         this.#totalQuantity = 0;

//     }

//    public addToCart(item: ITEM) {
//         this.#products?.push(item);
//     }
//     public getCart():Array<CART> {
//        return this.#products;
//     }


//     // removeFromCart(id: string) {
//     //     this.#cart = this.#cart?.filter((item) => item.productId! = id);
//     // }
//     // deleteMyCart() {
//     //     this.cart = [];
//     // }
//     // getMyCart() {
//     //     return this.cart;
//     // }
//     // addBillingAddress(address: IAddress) {
//     //     this.billingAddress = address;
//     // }
//     // addShippingAddress(address: IAddress) {
//     //     this.shippingAddress = address;
//     // }
//     // addTotalPrice(price: number) {
//     //     this.totalPrice = price;
//     // }

//     // incrementQuantity(id: string) {

//     //     let isExist = this.cart?.find((item) => item.productId == id);
//     //     if (isExist) {
//     //         this.cart?.forEach((Item) => {
//     //             if (Item.productId == id) {
//     //                 Item.qty++;
//     //                 Item.price += Item.price * Item.qty;
//     //             }
//     //         })
//     //     }
//     //     return this;
//     // }
//     // decrementQuantity(id: string) {

//     //     let isExist = this.cart?.find((item) => item.productId == id);
//     //     if (isExist) {
//     //         this.cart?.forEach((Item) => {
//     //             if (Item.productId == id) {
//     //                 --Item.qty;
//     //             }
//     //         })
//     //     }
//     //     return this;
//     // }
//     // getTotalPrice() {

//     //     return this.totalPrice;
//     // }
//     // calculateTotalPrice() {
//     //     if (!this.cart) return;
//     //     this.totalPrice = this.cart.reduce((acc, curr) => acc + curr.price, 0)
//     //     return this;
//     // }
//     // calculateTotalQty() {
//     //     // this.totalQuantity = this.cart?.length;
//     //     if (!this.cart) return;
//     //     this.totalQuantity = this.cart.reduce((acc, curr) => acc + curr.qty, 0)
//     //     return this;
//     // }


// }


