export interface IMAIL {
  sendMail: (template: string) => Promise<string>
}

export interface IEmailFields {
  EmailAddress: string
  FirstName: string
  ConfirmationLink: string
}

export interface LinkType {
  host: string
  port: string
  version: string
  route: string
  path: string
  id?: string
}
