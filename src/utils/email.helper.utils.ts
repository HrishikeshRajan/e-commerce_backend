import { type LinkType } from '../types/IEmail.interfaces'

export const generateUrl = (token: string, configs: LinkType): string => {
  if (token.length > 0) {
    return `http://${configs.host}:${configs.port}/api/${configs.version}/${configs.route}/${configs.path}/url?token=${token}`
  } else if (configs.id != null) {
    return `http://${configs.host}:${configs.port}/api/${configs.version}/${configs.route}/${configs.path}/${configs.id}`
  } else {
    return `http://${configs.host}:${configs.port}/api/${configs.version}/${configs.route}/${configs.path}`
  }
}

export const clientForgotPasswordUrl = (token: string, path: string): string => {
  return 'http://localhost:5173/' + path + '/' + token
}
export const clientUrl = (path: string): string => {
  return process.env.CLIENT_URL + path 
}
