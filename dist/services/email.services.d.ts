import { PasswordReset, type IMAIL } from '../types/IEmail.interfaces';
export default class EmailServices {
    send_mail(obj: IMAIL, template_Id: string): Promise<string>;
    sendPasswordResetConfirmationEmail(obj: IMAIL, templateId: string, fields: PasswordReset): Promise<string>;
}
//# sourceMappingURL=email.services.d.ts.map