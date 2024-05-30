"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentStrategy = exports.StripeStrategy = void 0;
/**
 * @class - Each class represents different strategy of the implementation of IWallet pay method
 */
class StripeStrategy {
    stripe;
    constructor(gateway) {
        this.stripe = gateway;
    }
    async pay(params) {
        const paymentIntent = await this.stripe.paymentIntents.create({
            amount: Math.trunc(params.amount),
            currency: 'inr',
            payment_method: params.paymentMethodId,
            confirm: true,
            off_session: true
        });
        return paymentIntent;
    }
}
exports.StripeStrategy = StripeStrategy;
/**
 * @class - Main class that invoke the pay method irrespective of the strategy
 */
class PaymentStrategy {
    amount;
    wallet;
    constructor(amount, wallet) {
        this.amount = amount;
        this.wallet = wallet;
    }
    async pay(paymentMethodId) {
        const result = await this.wallet.pay({ amount: this.amount, paymentMethodId });
        return result;
    }
}
exports.PaymentStrategy = PaymentStrategy;
//# sourceMappingURL=payment_strategy.js.map