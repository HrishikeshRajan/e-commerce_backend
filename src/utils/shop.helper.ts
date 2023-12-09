import { ShopCore, ShopDocument } from "@models/shopModel";
import { merge } from "lodash";

export const shopFilter = {
    sanitize:function <T extends ShopDocument>(shop: T): ShopCore{
        const copyObject = shop.toObject()
        delete copyObject.__v
        delete copyObject._id
        merge(copyObject, {     id: shop._id })
        return copyObject
    },
}
