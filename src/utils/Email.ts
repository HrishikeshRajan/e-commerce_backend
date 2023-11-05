import { CourierClient, ICourierClient } from '@trycourier/courier'
import { IEmailFields, IMAIL } from '../types/IEmail.interfaces';

export default class Mail implements IMAIL {
    private courier: ICourierClient;
    private firstname: string;
    private email: string;
    private url: string;
    public constructor(key: string, fields: IEmailFields) {
        this.courier = CourierClient({
            authorizationToken: key,
        });
        this.firstname = fields.FirstName;
        this.email = fields.EmailAddress;
        this.url = fields.ConfirmationLink;
    }
    async sendMail(templateId:string):Promise<string>{
        const { requestId } = await this.courier.send({
            message: {
                to: {
                    email: 'hrishikeshrajan3@gmail.com',
                },
                template: templateId,
                data: {
                    FirstName: this.firstname,
                    EmailAddress: this.email,
                    ConfirmationLink: this.url,
                    CompanyName: 'wizardstore',
                },
                routing: {
                    method: 'single',
                    channels: ['email'],
                },
            },
        });
    return requestId;
    }

}
