import { PasswordReset, type IEmailFields, type IMAIL } from '../types/IEmail.interfaces';
export default class Mail implements IMAIL {
    private readonly courier;
    private readonly firstname;
    private readonly email;
    private readonly url;
    constructor(key: string, fields: IEmailFields);
    sendPasswordResetConfirmationEmail(templateId: string, fields: PasswordReset): Promise<string>;
    sendMail(templateId: string): Promise<string>;
}
//# sourceMappingURL=Email.d.ts.map