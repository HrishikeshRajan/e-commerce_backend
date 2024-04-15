"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clientUrl = exports.clientForgotPasswordUrl = exports.generateUrl = void 0;
const generateUrl = (token, configs) => {
    if (token.length > 0) {
        return `http://${configs.host}:${configs.port}/api/${configs.version}/${configs.route}/${configs.path}/url?token=${token}`;
    }
    else if (configs.id != null) {
        return `http://${configs.host}:${configs.port}/api/${configs.version}/${configs.route}/${configs.path}/${configs.id}`;
    }
    else {
        return `http://${configs.host}:${configs.port}/api/${configs.version}/${configs.route}/${configs.path}`;
    }
};
exports.generateUrl = generateUrl;
const clientForgotPasswordUrl = (token, path) => {
    return 'http://localhost:5173/' + path + '/' + token;
};
exports.clientForgotPasswordUrl = clientForgotPasswordUrl;
const clientUrl = (path) => {
    return process.env.CLIENT_URL + path;
};
exports.clientUrl = clientUrl;
//# sourceMappingURL=email.helper.utils.js.map