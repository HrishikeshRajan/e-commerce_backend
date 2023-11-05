export interface IWallet {
  pay: (amount: number) => void
}

export class GooglePay implements IWallet {
  pay (amount: number) {
    console.log(`Paid with google pay, ${amount}`)
  }
}

export class Paytm implements IWallet {
  pay (amount: number) {
    console.log(`Paid with paytm, ${amount}`)
  }
}
