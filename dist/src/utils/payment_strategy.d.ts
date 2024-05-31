import type Stripe from 'stripe';
/**
 * This is an abstract class for payment method
 * pay - method is the interface for the user
 */
interface IWallet {
    pay: (params: any) => any;
}
/**
 * @class - Each class represents different strategy of the implementation of IWallet pay method
 */
export declare class StripeStrategy implements IWallet {
    private readonly stripe;
    constructor(gateway: Stripe);
    pay(params: any): Promise<Stripe.PaymentIntent>;
}
/**
 * @class - Main class that invoke the pay method irrespective of the strategy
 */
export declare class PaymentStrategy {
    private readonly amount;
    private readonly wallet;
    constructor(amount: number, wallet: IWallet);
    pay(paymentMethodId: string): Promise<any>;
}
export {};
//# sourceMappingURL=payment_strategy.d.ts.map