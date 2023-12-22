import { createLogger, format, level, transports } from 'winston'


export const productionLogger = () => createLogger({
    level:'info',
    format: format.combine(
        format.timestamp(),
        format.printf(({ timestamp, level, message }) => {
            return `${level}: [${timestamp}] ${message}`;
        })
    ),
    transports: [
        new transports.Console(),
        new transports.File({filename:"error.log"})
    ],
});