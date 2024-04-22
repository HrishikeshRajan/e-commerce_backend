import { NotifyMe, PasswordReset, type IMAIL } from '../types/IEmail.interfaces'

export default class EmailServices {
  async send_mail (obj: IMAIL, template_Id: string) {
    return await obj.sendMail(template_Id)
  }

  async sendPasswordResetConfirmationEmail(obj: IMAIL, templateId:string, fields:PasswordReset){
    return await obj.sendPasswordResetConfirmationEmail(templateId, fields)
  }
}
