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