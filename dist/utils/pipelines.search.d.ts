import { Types } from "mongoose";
export declare const getMatchPipleLine: (key: string, value: string) => {
    $match: {
        'order.orderId': Types.ObjectId;
        'order.product.name'?: undefined;
        'order.customerId._id'?: undefined;
        'order.product.productId'?: undefined;
        'order.qty'?: undefined;
        'order.product.stock'?: undefined;
        'order.options.size'?: undefined;
        'order.options.color'?: undefined;
        'order.product.price'?: undefined;
        'order.taxAmount'?: undefined;
        'order.totalPriceAfterTax'?: undefined;
        'order.paymentDetails.paymentId'?: undefined;
    };
    $search?: undefined;
} | {
    $search: {
        regex: {
            path: string;
            query: string;
        };
    };
    $match?: undefined;
} | {
    $match: {
        'order.product.name': string;
        'order.orderId'?: undefined;
        'order.customerId._id'?: undefined;
        'order.product.productId'?: undefined;
        'order.qty'?: undefined;
        'order.product.stock'?: undefined;
        'order.options.size'?: undefined;
        'order.options.color'?: undefined;
        'order.product.price'?: undefined;
        'order.taxAmount'?: undefined;
        'order.totalPriceAfterTax'?: undefined;
        'order.paymentDetails.paymentId'?: undefined;
    };
    $search?: undefined;
} | {
    $match: {
        'order.customerId._id': Types.ObjectId;
        'order.orderId'?: undefined;
        'order.product.name'?: undefined;
        'order.product.productId'?: undefined;
        'order.qty'?: undefined;
        'order.product.stock'?: undefined;
        'order.options.size'?: undefined;
        'order.options.color'?: undefined;
        'order.product.price'?: undefined;
        'order.taxAmount'?: undefined;
        'order.totalPriceAfterTax'?: undefined;
        'order.paymentDetails.paymentId'?: undefined;
    };
    $search?: undefined;
} | {
    $match: {
        'order.product.productId': Types.ObjectId;
        'order.orderId'?: undefined;
        'order.product.name'?: undefined;
        'order.customerId._id'?: undefined;
        'order.qty'?: undefined;
        'order.product.stock'?: undefined;
        'order.options.size'?: undefined;
        'order.options.color'?: undefined;
        'order.product.price'?: undefined;
        'order.taxAmount'?: undefined;
        'order.totalPriceAfterTax'?: undefined;
        'order.paymentDetails.paymentId'?: undefined;
    };
    $search?: undefined;
} | {
    $match: {
        'order.qty': number;
        'order.orderId'?: undefined;
        'order.product.name'?: undefined;
        'order.customerId._id'?: undefined;
        'order.product.productId'?: undefined;
        'order.product.stock'?: undefined;
        'order.options.size'?: undefined;
        'order.options.color'?: undefined;
        'order.product.price'?: undefined;
        'order.taxAmount'?: undefined;
        'order.totalPriceAfterTax'?: undefined;
        'order.paymentDetails.paymentId'?: undefined;
    };
    $search?: undefined;
} | {
    $match: {
        'order.product.stock': number;
        'order.orderId'?: undefined;
        'order.product.name'?: undefined;
        'order.customerId._id'?: undefined;
        'order.product.productId'?: undefined;
        'order.qty'?: undefined;
        'order.options.size'?: undefined;
        'order.options.color'?: undefined;
        'order.product.price'?: undefined;
        'order.taxAmount'?: undefined;
        'order.totalPriceAfterTax'?: undefined;
        'order.paymentDetails.paymentId'?: undefined;
    };
    $search?: undefined;
} | {
    $match: {
        'order.options.size': string;
        'order.orderId'?: undefined;
        'order.product.name'?: undefined;
        'order.customerId._id'?: undefined;
        'order.product.productId'?: undefined;
        'order.qty'?: undefined;
        'order.product.stock'?: undefined;
        'order.options.color'?: undefined;
        'order.product.price'?: undefined;
        'order.taxAmount'?: undefined;
        'order.totalPriceAfterTax'?: undefined;
        'order.paymentDetails.paymentId'?: undefined;
    };
    $search?: undefined;
} | {
    $match: {
        'order.options.color': string;
        'order.orderId'?: undefined;
        'order.product.name'?: undefined;
        'order.customerId._id'?: undefined;
        'order.product.productId'?: undefined;
        'order.qty'?: undefined;
        'order.product.stock'?: undefined;
        'order.options.size'?: undefined;
        'order.product.price'?: undefined;
        'order.taxAmount'?: undefined;
        'order.totalPriceAfterTax'?: undefined;
        'order.paymentDetails.paymentId'?: undefined;
    };
    $search?: undefined;
} | {
    $match: {
        'order.product.price': number;
        'order.orderId'?: undefined;
        'order.product.name'?: undefined;
        'order.customerId._id'?: undefined;
        'order.product.productId'?: undefined;
        'order.qty'?: undefined;
        'order.product.stock'?: undefined;
        'order.options.size'?: undefined;
        'order.options.color'?: undefined;
        'order.taxAmount'?: undefined;
        'order.totalPriceAfterTax'?: undefined;
        'order.paymentDetails.paymentId'?: undefined;
    };
    $search?: undefined;
} | {
    $match: {
        'order.taxAmount': number;
        'order.orderId'?: undefined;
        'order.product.name'?: undefined;
        'order.customerId._id'?: undefined;
        'order.product.productId'?: undefined;
        'order.qty'?: undefined;
        'order.product.stock'?: undefined;
        'order.options.size'?: undefined;
        'order.options.color'?: undefined;
        'order.product.price'?: undefined;
        'order.totalPriceAfterTax'?: undefined;
        'order.paymentDetails.paymentId'?: undefined;
    };
    $search?: undefined;
} | {
    $match: {
        'order.totalPriceAfterTax': {
            $gte: number;
        };
        'order.orderId'?: undefined;
        'order.product.name'?: undefined;
        'order.customerId._id'?: undefined;
        'order.product.productId'?: undefined;
        'order.qty'?: undefined;
        'order.product.stock'?: undefined;
        'order.options.size'?: undefined;
        'order.options.color'?: undefined;
        'order.product.price'?: undefined;
        'order.taxAmount'?: undefined;
        'order.paymentDetails.paymentId'?: undefined;
    };
    $search?: undefined;
} | {
    $match: {
        'order.paymentDetails.paymentId': string;
        'order.orderId'?: undefined;
        'order.product.name'?: undefined;
        'order.customerId._id'?: undefined;
        'order.product.productId'?: undefined;
        'order.qty'?: undefined;
        'order.product.stock'?: undefined;
        'order.options.size'?: undefined;
        'order.options.color'?: undefined;
        'order.product.price'?: undefined;
        'order.taxAmount'?: undefined;
        'order.totalPriceAfterTax'?: undefined;
    };
    $search?: undefined;
} | null;
//# sourceMappingURL=pipelines.search.d.ts.map