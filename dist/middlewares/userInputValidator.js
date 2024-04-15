"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRequest = void 0;
function validateRequest(validators) {
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
exports.validateRequest = validateRequest;
//# sourceMappingURL=userInputValidator.js.map