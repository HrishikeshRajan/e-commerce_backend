"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const courier_1 = require("@trycourier/courier");
class Mail {
    courier;
    firstname;
    email;
    url;
    constructor(key, fields) {
        this.courier = (0, courier_1.CourierClient)({
            authorizationToken: key
        });
        this.firstname = fields.FirstName;
        this.email = fields.EmailAddress;
        this.url = fields.ConfirmationLink;
    }
    async sendPasswordResetConfirmationEmail(templateId, fields) {
        const { requestId } = await this.courier.send({
            message: {
                to: {
                    email: this.email,
                },
                template: templateId,
                data: {
                    ...fields
                },
                routing: {
                    method: 'single',
                    channels: ['email']
                }
            }
        });
        return requestId;
    }
    async sendMail(templateId) {
        const { requestId } = await this.courier.send({
            message: {
                to: {
                    email: this.email,
                },
                template: templateId,
                data: {
                    FirstName: this.firstname,
                    EmailAddress: this.email,
                    ConfirmationLink: this.url,
                    SenderName: 'wondercart'
                },
                routing: {
                    method: 'single',
                    channels: ['email']
                }
            }
        });
        return requestId;
    }
}
exports.default = Mail;
//# sourceMappingURL=Email.js.map