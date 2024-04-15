import { type IMAIL } from '../types/IEmail.interfaces';
export default class EmailServices {
    send_mail(obj: IMAIL, template_Id: string): Promise<string>;
}
//# sourceMappingURL=email.services.d.ts.map