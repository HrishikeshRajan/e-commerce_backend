"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PhotoSchema = exports.UpdateProfileSchema = exports.QueryWithTokenSchema = exports.ParamsByAddressIdSchema = exports.ParamsSchema = exports.ParamsByIdSchema = exports.UserAddressSchema = exports.AddressSchemaWithAddressId = exports.AddresSchema = exports.ChangePasswordSchema = exports.ResetPasswordSchema = exports.ForgotPasswordSchema = exports.RegisterSchema = exports.LoginSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const zod_1 = __importDefault(require("zod"));
const Countries = ['India'];
const Gender = ['Male', 'Female', 'Unisex'];
exports.LoginSchema = zod_1.default.object({
    email: zod_1.default.string().min(4),
    password: zod_1.default.string(),
    recaptchaToken: zod_1.default.string().optional()
});
exports.RegisterSchema = zod_1.default.object({
    fullname: zod_1.default
        .string()
        .min(3, 'fullname must be at least 2 characters')
        .max(255, 'fullanme can be at most 255 characters'),
    email: zod_1.default
        .string()
        .email({ message: 'Please provide a valid email address' })
        .min(3, 'Email address must be at least 3 characters')
        .max(255, 'Email address can be at most 255 characters'),
    password: zod_1.default
        .string()
        .min(8, { message: 'Password must be at least 8 characters' })
        .max(100, { message: 'Password can be at most 100 characters' })
        .regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+{}|:;<>,.?~]+$/, 'Password must contain at least one letter and one number'),
    recaptchaToken: zod_1.default.string().optional()
});
exports.ForgotPasswordSchema = zod_1.default.object({
    email: zod_1.default
        .string()
        .min(4)
        .email(),
    recaptchaToken: zod_1.default.string().optional()
});
exports.ResetPasswordSchema = zod_1.default.object({
    password: zod_1.default
        .string()
        .min(4, { message: 'Password must be at least 8 characters' })
        .max(100, { message: 'Password can be at most 100 characters' })
        .regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+{}|:;<>,.?~]+$/, 'Password must contain at least one letter and one number'),
    token: zod_1.default
        .string()
});
exports.ChangePasswordSchema = zod_1.default.object({
    currentPassword: zod_1.default
        .string()
        .min(8, { message: 'Password must be at least 8 characters' })
        .max(100, { message: 'Password can be at most 100 characters' })
        .regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+{}|:;<>,.?~]+$/, 'Password must contain at least one letter and one number'),
    newPassword: zod_1.default
        .string()
        .min(8, { message: 'Password must be at least 8 characters' })
        .max(100, { message: 'Password can be at most 100 characters' })
        .regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+{}|:;<>,.?~]+$/, 'Password must contain at least one letter and one number')
});
// This is for order object
exports.AddresSchema = zod_1.default.object({
    orderId: zod_1.default.string().refine((id) => {
        if (mongoose_1.default.isValidObjectId(id)) {
            return true;
        }
        else {
            return false;
        }
    }, { message: 'Invalid product id' }),
    fullname: zod_1.default.string().min(4),
    city: zod_1.default.string().min(3),
    homeAddress: zod_1.default.string().min(3),
    state: zod_1.default.string().min(2),
    postalCode: zod_1.default.number(),
    phoneNo: zod_1.default.string().min(1),
    country: zod_1.default.string()
});
// This is for user profile
exports.AddressSchemaWithAddressId = zod_1.default.object({
    addressId: zod_1.default.string({
        required_error: 'address id must be provided',
        invalid_type_error: 'addressId must be a string'
    }).refine((id) => {
        if (mongoose_1.default.isValidObjectId(id)) {
            return true;
        }
        else {
            return false;
        }
    }, { message: 'Invalid address id' }),
    fullname: zod_1.default.string({
        invalid_type_error: 'fullname must be a string'
    }).max(100, { message: 'Must be 100 or fewer characters' }).optional(),
    city: zod_1.default.string({
        invalid_type_error: 'city must be a string'
    }).max(50, { message: 'Maximum 50 characters' }).optional(),
    homeAddress: zod_1.default.string({
        invalid_type_error: 'address must be a string'
    }).max(200, { message: 'Maximum 100 characters' }).optional(),
    state: zod_1.default.string({
        invalid_type_error: 'State must be a string'
    }).max(50, { message: 'Maximum 50 characters' }).optional(),
    postalCode: zod_1.default.string({
        invalid_type_error: 'Postal Code must be a string'
    }).refine((postalCode) => {
        if (postalCode.length > 0) {
            return /^[1-9]{1}[0-9]{2}\s{0,1}[0-9]{3}$/.test(postalCode);
        }
        return true;
    }, { message: 'Please provide a valid postal code' })
        .optional(),
    phoneNo: zod_1.default.string({
        invalid_type_error: 'Phone number must be a string'
    }).refine((phoneNo) => {
        if (/^[6-9]\d{9}$/.test(phoneNo)) {
            return true;
        }
        return false;
    }, { message: 'Please provide a valid mobile number' })
        .optional(),
    country: zod_1.default.enum(Countries).optional()
});
exports.UserAddressSchema = zod_1.default.object({
    fullname: zod_1.default.string({
        required_error: 'fullame is required',
        invalid_type_error: 'fullname must be a string'
    }).min(4, { message: 'Must be 4 or more characters long' }).max(100, { message: 'Must be 100 or fewer characters' }),
    city: zod_1.default.string({
        required_error: 'city is required',
        invalid_type_error: 'city must be a string'
    }).min(3, { message: 'Minimum 3 characters' }).max(50, { message: 'Maximum 50 characters' }),
    homeAddress: zod_1.default.string({
        required_error: 'address is required',
        invalid_type_error: 'address must be a string'
    }).min(10, { message: 'Minimum 10 characters' }).max(200, { message: 'Maximum 100 characters' }),
    state: zod_1.default.string({
        required_error: 'State is required',
        invalid_type_error: 'State must be a string'
    }).min(3, { message: 'Minimum 3 characters' }).max(50, { message: 'Maximum 50 characters' }),
    postalCode: zod_1.default.string({
        required_error: 'Postal Code is required',
        invalid_type_error: 'Postal Code must be a string'
    }).regex(/^[1-9]{1}[0-9]{2}\s{0,1}[0-9]{3}$/, { message: 'Please provide a valid postal code' }),
    phoneNo: zod_1.default.string({
        required_error: 'Phone number is required',
        invalid_type_error: 'Phone number must be a string'
    }).regex(/^[6-9]\d{9}$/, { message: 'Please provide a valid mobile number' }),
    country: zod_1.default.enum(Countries)
});
exports.ParamsByIdSchema = zod_1.default.object({
    id: zod_1.default.string().min(1).refine((id) => {
        if (mongoose_1.default.isValidObjectId(id)) {
            return true;
        }
        else {
            return false;
        }
    }, {
        message: 'Invalid ObjectId'
    })
});
exports.ParamsSchema = zod_1.default.object({
    id: zod_1.default.string()
});
exports.ParamsByAddressIdSchema = zod_1.default.object({
    addressId: zod_1.default.string().min(1).refine((id) => {
        if (mongoose_1.default.isValidObjectId(id)) {
            return true;
        }
        else {
            return false;
        }
    }, {
        message: 'Invalid ObjectId'
    })
});
exports.QueryWithTokenSchema = zod_1.default.object({
    token: zod_1.default.string().min(1)
});
exports.UpdateProfileSchema = zod_1.default.object({
    fullname: zod_1.default.string(),
    email: zod_1.default.string().email(),
    username: zod_1.default.string(),
});
exports.PhotoSchema = zod_1.default.object({
    image: zod_1.default.any({
        required_error: 'Please provide an image'
    })
});
//# sourceMappingURL=user.schemaTypes.js.map