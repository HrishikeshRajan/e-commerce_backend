import { LinkType } from "../types/IEmail.interfaces";

export const generateUrl = (token: string, configs: LinkType): string => {
    if (token) {
        return `https://${configs.host}:${configs.port}/${configs.version}/${configs.route}/${configs.path}/${token}`;
    } else if (configs.id) {
        return `https://${configs.host}:${configs.port}/${configs.version}/${configs.route}/${configs.path}/${configs.id}`;

    } else {
        return `https://${configs.host}:${configs.port}/${configs.version}/${configs.route}/${configs.path}`;

    }

}