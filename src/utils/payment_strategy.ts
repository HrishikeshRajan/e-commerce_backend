import type Stripe from 'stripe'

/**
 * This is an abstract class for payment method
 * pay - method is the interface for the user
 */
interface IWallet {
  pay: (params: any) => any
}

/**
 * @class - Each class represents different strategy of the implementation of IWallet pay method
 */
export class StripeStrategy implements IWallet {
  private readonly stripe: Stripe
  constructor (gateway: Stripe) {
    this.stripe = gateway
  }

  async pay (params: any): Promise<Stripe.PaymentIntent> {
    const paymentIntent: Stripe.PaymentIntent = await this.stripe.paymentIntents.create({
      amount: Math.trunc(params.amount),
      currency: 'inr',
      payment_method: params.paymentMethodId,
      confirm: true,
      off_session: true

    })
    return paymentIntent
  }
}

/**
 * @class - Main class that invoke the pay method irrespective of the strategy
 */
export class PaymentStrategy {
  private readonly amount: number
  private readonly wallet: IWallet

  constructor (amount: number, wallet: IWallet) {
    this.amount = amount
    this.wallet = wallet
  }

  async pay (paymentMethodId: string): Promise<any> {
    const result = await this.wallet.pay({ amount: this.amount, paymentMethodId })
    return result
  }
}
