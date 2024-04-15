"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class EmailServices {
    async send_mail(obj, template_Id) {
        return await obj.sendMail(template_Id);
    }
}
exports.default = EmailServices;
//# sourceMappingURL=email.services.js.map