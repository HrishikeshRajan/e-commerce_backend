"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTax = void 0;
const currency_js_1 = __importDefault(require("currency.js"));
const getTax = (productPrice) => {
    const gst = 12;
    const tax = (0, currency_js_1.default)(productPrice).multiply(gst).divide(100).value;
    return Math.floor(tax);
};
exports.getTax = getTax;
//# sourceMappingURL=tax.util.js.map