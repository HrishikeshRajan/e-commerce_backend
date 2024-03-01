import { createLogger, format, level, transports } from 'winston'


export const devLogger = () => createLogger({
    level:'silly',
    format: format.combine(
        format.colorize(),
        format.timestamp({format: "HH:mm:ss"}),
        format.printf(({ timestamp, level, message }) => {
            return `${level}: [${timestamp}] ${message}`;
        })
    ),
    transports: [new transports.Console()],
});



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


let logger = devLogger
if (process.env.NODE_ENV === 'production') {
    logger = productionLogger
}

export default logger()

