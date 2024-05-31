"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Paytm = exports.GooglePay = void 0;
class GooglePay {
    pay(amount) {
        console.log(`Paid with google pay, ${amount}`);
    }
}
exports.GooglePay = GooglePay;
class Paytm {
    pay(amount) {
        console.log(`Paid with paytm, ${amount}`);
    }
}
exports.Paytm = Paytm;
//# sourceMappingURL=payment.repository.js.map