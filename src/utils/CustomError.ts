class CustomError extends Error {
    public code: number;
    public success: boolean;

    constructor(message: string , code: number, success: boolean) {
        super(message);
        this.name = this.constructor.name;
  
        this.code = code;
        this.success = success;
        Error.captureStackTrace(this, this.constructor);        
    }
}
export default CustomError;  