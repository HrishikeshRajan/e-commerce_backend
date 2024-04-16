"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-misused-promises */
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/userController");
const auth_1 = require("../middlewares/auth");
const image_helper_1 = require("../utils/image.helper");
const user_schemaTypes_1 = require("../types/zod/user.schemaTypes");
const userInputValidator_1 = require("../middlewares/userInputValidator");
/**
 * Limits number of requests
 */
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000,
//   limit: Number(process.env.RATE_LIMIT || '5'), 
//   standardHeaders: 'draft-7',
//   legacyHeaders: false,
//   statusCode: 429,
//   handler: (req, res, next, options) => {
//     next(new CustomError(options.message, options.statusCode, false))
//   }
// })
const router = express_1.default.Router();
// Auth API
router.route('/register')
    .post(auth_1.disallowLoggedInUsers, (0, userInputValidator_1.validateRequest)({ body: user_schemaTypes_1.RegisterSchema }), userController_1.registerUser);
router.route('/verify')
    .get(auth_1.disallowLoggedInUsers, (0, userInputValidator_1.validateRequest)({ query: user_schemaTypes_1.QueryWithTokenSchema }), userController_1.verifyMailLink);
router.route('/login')
    .post(auth_1.disallowLoggedInUsers, (0, userInputValidator_1.validateRequest)({ body: user_schemaTypes_1.LoginSchema }), userController_1.loginUser);
router.route('/read')
    .get(auth_1.isLoggedIn, userController_1.readUser);
router.route('/signout').get(auth_1.isLoggedIn, userController_1.logoutUser);
router.route('/forgot')
    .post(auth_1.disallowLoggedInUsers, (0, userInputValidator_1.validateRequest)({ body: user_schemaTypes_1.ForgotPasswordSchema }), userController_1.forgotPassword);
router.route('/forgot/verify')
    .get(auth_1.disallowLoggedInUsers, userController_1.verifyForgotPassword);
router.route('/forgot/reset')
    .put(auth_1.disallowLoggedInUsers, (0, userInputValidator_1.validateRequest)({ body: user_schemaTypes_1.ResetPasswordSchema }), userController_1.resetPassword);
router.route('/change/password')
    .put(auth_1.isLoggedIn, (0, userInputValidator_1.validateRequest)({ body: user_schemaTypes_1.ChangePasswordSchema }), userController_1.changePassword);
router.route('/address')
    .post(auth_1.isLoggedIn, (0, userInputValidator_1.validateRequest)({ body: user_schemaTypes_1.UserAddressSchema }), userController_1.addAddress);
router.route('/address/:id').put(auth_1.isLoggedIn, (0, userInputValidator_1.validateRequest)({ body: user_schemaTypes_1.UserAddressSchema }), (0, userInputValidator_1.validateRequest)({ params: user_schemaTypes_1.ParamsByIdSchema }), userController_1.editAddress);
router.route('/address/:id')
    .delete(auth_1.isLoggedIn, (0, userInputValidator_1.validateRequest)({ params: user_schemaTypes_1.ParamsByIdSchema }), userController_1.deleteAddress);
router.route('/address')
    .get(auth_1.isLoggedIn, userController_1.myAddress);
router.route('/profile')
    .get(auth_1.isLoggedIn, userController_1.showProfile);
router.route('/profile')
    .put(auth_1.isLoggedIn, (0, userInputValidator_1.validateRequest)({ body: user_schemaTypes_1.UpdateProfileSchema }), userController_1.editProfile);
router.route('/profile-picture')
    .put(auth_1.isLoggedIn, (0, userInputValidator_1.validateRequest)({ body: user_schemaTypes_1.PhotoSchema }), image_helper_1.multerUpload, userController_1.uploadProfilePicture);
router.route('/profile-picture')
    .delete(auth_1.isLoggedIn, userController_1.deleteProfilePicture);
//Is loggedIn 
router.route('/authStatus')
    .get(auth_1.isLoggedIn, userController_1.isUserLoggedInStatus);
exports.default = router;
//# sourceMappingURL=userRouter.js.map