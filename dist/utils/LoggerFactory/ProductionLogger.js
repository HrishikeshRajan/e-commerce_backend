"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productionLogger = void 0;
const winston_1 = require("winston");
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
exports.productionLogger = productionLogger;
//# sourceMappingURL=ProductionLogger.js.map