export interface IMAIL {
    sendMail: (template: string) => Promise<string>;
    sendPasswordResetConfirmationEmail: (templateId: string, fields: PasswordReset) => Promise<string>;
}
export interface IEmailFields {
    EmailAddress: string;
    FirstName: string;
    ConfirmationLink: string;
}
export interface PasswordReset {
    firstName: string;
    resetLink: string;
    companyName: string;
}
export interface NotifyMe {
    FirstName: string;
    FlashSaleLink: string;
    Company: string;
}
export interface LinkType {
    host: string;
    port: string;
    version: string;
    route: string;
    path: string;
    id?: string;
}
//# sourceMappingURL=IEmail.interfaces.d.ts.map