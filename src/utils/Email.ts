import { CourierClient, type ICourierClient } from '@trycourier/courier'
import { type IEmailFields, type IMAIL } from '../types/IEmail.interfaces'

export default class Mail implements IMAIL {
  private readonly courier: ICourierClient
  private readonly firstname: string
  private readonly email: string
  private readonly url: string
  public constructor (key: string, fields: IEmailFields) {
    this.courier = CourierClient({
      authorizationToken: key
    })
    this.firstname = fields.FirstName
    this.email = fields.EmailAddress
    this.url = fields.ConfirmationLink
  }

  async sendMail (templateId: string): Promise<string> {
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
    })
    return requestId
  }
}
