"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productFilter = void 0;
const lodash_1 = require("lodash");
exports.productFilter = {
    sanitize: function (shop) {
        const copyObject = shop.toObject();
        delete copyObject.__v;
        delete copyObject._id;
        (0, lodash_1.merge)(copyObject, { id: shop._id });
        return copyObject;
    },
};
//# sourceMappingURL=product.helper.js.map