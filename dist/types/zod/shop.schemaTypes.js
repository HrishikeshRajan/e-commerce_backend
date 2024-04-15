"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShopsIds = void 0;
const zod_1 = require("zod");
exports.ShopsIds = zod_1.z.object({
    shopsIds: zod_1.z.array(zod_1.z.string())
}).strict({ message: 'Please provide valid shop ids' });
//# sourceMappingURL=shop.schemaTypes.js.map