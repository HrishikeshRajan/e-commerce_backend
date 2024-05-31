"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserId = exports.userFilter = exports.responseFilter = void 0;
const responseFilter = (user) => {
    const newUser = { ...user };
    delete newUser.password;
    delete newUser.forgotPasswordTokenId;
    delete newUser.forgotpasswordTokenVerfied;
    delete newUser.unVerifiedUserExpires;
    delete newUser.createdAt;
    delete newUser.updatedAt;
    return newUser;
};
exports.responseFilter = responseFilter;
const userFilter = (user) => {
    const newUser = { ...user };
    newUser._id = newUser._id.toString();
    delete newUser.password;
    delete newUser.forgotPasswordTokenId;
    delete newUser.forgotpasswordTokenVerfied;
    delete newUser.unVerifiedUserExpires;
    delete newUser.createdAt;
    delete newUser.updatedAt;
    delete newUser.__v;
    delete newUser.forgotPasswordTokenExpiry;
    return newUser;
};
exports.userFilter = userFilter;
const getUserId = (req) => req.user?.id || null;
exports.getUserId = getUserId;
//# sourceMappingURL=user.helper.js.map