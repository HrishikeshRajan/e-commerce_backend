"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMatchPipleLine = void 0;
const mongoose_1 = require("mongoose");
const getMatchPipleLine = (key, value) => {
    switch (key) {
        case 'orderId': return {
            '$match': {
                //@ts-ignore
                'order.orderId': new mongoose_1.Types.ObjectId(value)
            }
        };
        case 'productNames': return {
            "$search": {
                "regex": {
                    "path": "order.product.name",
                    "query": value
                }
            }
        };
        case 'productName': return {
            '$match': {
                //@ts-ignore
                'order.product.name': value
            }
        };
        case 'customerId': return {
            '$match': {
                //@ts-ignore
                'order.customerId._id': new mongoose_1.Types.ObjectId(value)
            }
        };
        case 'productId': return {
            '$match': {
                //@ts-ignore
                'order.product.productId': new mongoose_1.Types.ObjectId(value)
            }
        };
        case 'qty': return {
            '$match': {
                //@ts-ignore
                'order.qty': Number(value)
            }
        };
        case 'stock': return {
            '$match': {
                //@ts-ignore
                'order.product.stock': Number(value)
            }
        };
        case 'size': return {
            '$match': {
                //@ts-ignore
                'order.options.size': value
            }
        };
        case 'color': return {
            '$match': {
                //@ts-ignore
                'order.options.color': value
            }
        };
        case 'productPrice': return {
            '$match': {
                //@ts-ignore
                'order.product.price': Number(value)
            }
        };
        case 'taxAmount': return {
            '$match': {
                //@ts-ignore
                'order.taxAmount': Number(value)
            }
        };
        case 'totalPriceAfterTax': return {
            '$match': {
                //@ts-ignore
                'order.totalPriceAfterTax': {
                    '$gte': Number(value)
                }
            }
        };
        case 'paymentId': return {
            '$match': {
                //@ts-ignore
                'order.paymentDetails.paymentId': value
            }
        };
        default: return null;
    }
};
exports.getMatchPipleLine = getMatchPipleLine;
//# sourceMappingURL=pipelines.search.js.map