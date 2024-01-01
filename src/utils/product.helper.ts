
import { merge } from "lodash";
import { ProductCore, ProductDocument } from "types/product.interface";

export const productFilter = {
    sanitize:function <T extends ProductDocument>(shop: T): ProductCore{
        const copyObject = shop.toObject()
        delete copyObject.__v
        delete copyObject._id
        merge(copyObject, {  id: shop._id })
        return copyObject
    },
}
