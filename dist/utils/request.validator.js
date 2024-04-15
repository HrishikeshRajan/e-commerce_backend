"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VALIDATE_REQUEST = void 0;
function VALIDATE_REQUEST(validators) {
    return async (req, res, next) => {
        try {
            if (validators.params != null) {
                req.params = await validators.params.parseAsync(req.params);
            }
            if (validators.body != null) {
                req.body = await validators.body.parseAsync(req.body);
            }
            if (validators.query != null) {
                req.query = await validators.query.parseAsync(req.query);
            }
            next();
        }
        catch (error) {
            next(error);
        }
    };
}
exports.VALIDATE_REQUEST = VALIDATE_REQUEST;
//# sourceMappingURL=request.validator.js.map