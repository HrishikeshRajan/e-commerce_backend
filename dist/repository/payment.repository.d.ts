export interface IWallet {
    pay: (amount: number) => void;
}
export declare class GooglePay implements IWallet {
    pay(amount: number): void;
}
export declare class Paytm implements IWallet {
    pay(amount: number): void;
}
//# sourceMappingURL=payment.repository.d.ts.map