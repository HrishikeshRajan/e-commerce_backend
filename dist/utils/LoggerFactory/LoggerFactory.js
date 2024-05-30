"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.devLogger = void 0;
const winston_1 = require("winston");
const devLogger = () => (0, winston_1.createLogger)({
    level: 'silly',
    format: winston_1.format.combine(winston_1.format.colorize(), winston_1.format.timestamp({ format: "HH:mm:ss" }), winston_1.format.printf(({ timestamp, level, message }) => {
        return `${level}: [${timestamp}] ${message}`;
    })),
    transports: [new winston_1.transports.Console()],
});
exports.devLogger = devLogger;
const productionLogger = () => (0, winston_1.createLogger)({
    level: 'info',
    format: winston_1.format.combine(winston_1.format.timestamp(), winston_1.format.printf(({ timestamp, level, message }) => {
        return `${level}: [${timestamp}] ${message}`;
    })),
    transports: [
        new winston_1.transports.Console(),
        new winston_1.transports.File({ filename: "error.log" })
    ],
});
class LoggerFactory {
    static getLogger(type) {
        if (type === 'production') {
            return productionLogger;
        }
        else
            return exports.devLogger;
    }
}
exports.default = LoggerFactory;
//# sourceMappingURL=LoggerFactory.js.map