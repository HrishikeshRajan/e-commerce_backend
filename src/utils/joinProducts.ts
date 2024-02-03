/* eslint-disable security/detect-object-injection */

import CartModel, { CartCore, CartDocument, CartItemCore, ResponseCart } from "@models/cartModel";
import productModel from "@models/productModel";
import { CART } from "types";
import { ProductCore } from '../types/product.interface'
/* eslint-disable no-restricted-syntax */
export const replaceCartIdsWithProducts = async (cart: CartDocument) => {
    const oldCart = cart;
    const newCart: ResponseCart = {
        products: {},
        grandTotalPrice: oldCart.grandTotalPrice,
        grandTotalQty: oldCart.grandTotalQty,
        userId: cart.userId,
        cartId: cart._id
    };

    const { products } = oldCart;

    const keys = Array.from(products);

    for (const key of keys) {
        const modifiedItem: CartItemCore = {
            qty: 0,
            totalPrice: 0,
            options: {
                color: '',
                size: '',
            },
            product: {}
        };
        const itemId = key[0];
        const product = await productModel.findById(itemId)
        modifiedItem.product = product
        modifiedItem.options = key[1].options;
        modifiedItem.qty = key[1].qty;
        modifiedItem.totalPrice = key[1].totalPrice;
        newCart.products[key[0]] = modifiedItem;
    }

    return { cart: newCart };
};
