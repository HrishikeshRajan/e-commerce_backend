declare class CustomError extends Error {
    code: number;
    success: boolean;
    constructor(message: string, code: number, success: boolean);
}
export default CustomError;
//# sourceMappingURL=CustomError.d.ts.map