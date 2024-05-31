declare global {
    namespace Express {
        interface Request {
            user?: any;
            cart?: any;
        }
    }
}
declare module 'http' {
    interface IncomingMessage {
        rawBody: any;
        originalUrl?: string;
    }
}
export {};
//# sourceMappingURL=custom.d.ts.map