import z from 'zod';
export declare const LoginSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
    recaptchaToken: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
    recaptchaToken?: string | undefined;
}, {
    email: string;
    password: string;
    recaptchaToken?: string | undefined;
}>;
export declare const RegisterSchema: z.ZodObject<{
    fullname: z.ZodString;
    email: z.ZodString;
    password: z.ZodString;
    recaptchaToken: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
    fullname: string;
    recaptchaToken?: string | undefined;
}, {
    email: string;
    password: string;
    fullname: string;
    recaptchaToken?: string | undefined;
}>;
export declare const ForgotPasswordSchema: z.ZodObject<{
    email: z.ZodString;
    recaptchaToken: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    email: string;
    recaptchaToken?: string | undefined;
}, {
    email: string;
    recaptchaToken?: string | undefined;
}>;
export declare const ResetPasswordSchema: z.ZodObject<{
    password: z.ZodString;
    token: z.ZodString;
}, "strip", z.ZodTypeAny, {
    token: string;
    password: string;
}, {
    token: string;
    password: string;
}>;
export declare const ChangePasswordSchema: z.ZodObject<{
    currentPassword: z.ZodString;
    newPassword: z.ZodString;
}, "strip", z.ZodTypeAny, {
    currentPassword: string;
    newPassword: string;
}, {
    currentPassword: string;
    newPassword: string;
}>;
export declare const AddresSchema: z.ZodObject<{
    orderId: z.ZodEffects<z.ZodString, string, string>;
    fullname: z.ZodString;
    city: z.ZodString;
    homeAddress: z.ZodString;
    state: z.ZodString;
    postalCode: z.ZodNumber;
    phoneNo: z.ZodString;
    country: z.ZodString;
}, "strip", z.ZodTypeAny, {
    fullname: string;
    orderId: string;
    city: string;
    homeAddress: string;
    state: string;
    postalCode: number;
    phoneNo: string;
    country: string;
}, {
    fullname: string;
    orderId: string;
    city: string;
    homeAddress: string;
    state: string;
    postalCode: number;
    phoneNo: string;
    country: string;
}>;
export declare const AddressSchemaWithAddressId: z.ZodObject<{
    addressId: z.ZodEffects<z.ZodString, string, string>;
    fullname: z.ZodOptional<z.ZodString>;
    city: z.ZodOptional<z.ZodString>;
    homeAddress: z.ZodOptional<z.ZodString>;
    state: z.ZodOptional<z.ZodString>;
    postalCode: z.ZodOptional<z.ZodEffects<z.ZodString, string, string>>;
    phoneNo: z.ZodOptional<z.ZodEffects<z.ZodString, string, string>>;
    country: z.ZodOptional<z.ZodEnum<["India"]>>;
}, "strip", z.ZodTypeAny, {
    addressId: string;
    fullname?: string | undefined;
    city?: string | undefined;
    homeAddress?: string | undefined;
    state?: string | undefined;
    postalCode?: string | undefined;
    phoneNo?: string | undefined;
    country?: "India" | undefined;
}, {
    addressId: string;
    fullname?: string | undefined;
    city?: string | undefined;
    homeAddress?: string | undefined;
    state?: string | undefined;
    postalCode?: string | undefined;
    phoneNo?: string | undefined;
    country?: "India" | undefined;
}>;
export declare const UserAddressSchema: z.ZodObject<{
    fullname: z.ZodString;
    city: z.ZodString;
    homeAddress: z.ZodString;
    state: z.ZodString;
    postalCode: z.ZodString;
    phoneNo: z.ZodString;
    country: z.ZodEnum<["India"]>;
}, "strip", z.ZodTypeAny, {
    fullname: string;
    city: string;
    homeAddress: string;
    state: string;
    postalCode: string;
    phoneNo: string;
    country: "India";
}, {
    fullname: string;
    city: string;
    homeAddress: string;
    state: string;
    postalCode: string;
    phoneNo: string;
    country: "India";
}>;
export declare const ParamsByIdSchema: z.ZodObject<{
    id: z.ZodEffects<z.ZodString, string, string>;
}, "strip", z.ZodTypeAny, {
    id: string;
}, {
    id: string;
}>;
export declare const ParamsSchema: z.ZodObject<{
    id: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
}, {
    id: string;
}>;
export declare const ParamsByAddressIdSchema: z.ZodObject<{
    addressId: z.ZodEffects<z.ZodString, string, string>;
}, "strip", z.ZodTypeAny, {
    addressId: string;
}, {
    addressId: string;
}>;
export declare const QueryWithTokenSchema: z.ZodObject<{
    token: z.ZodString;
}, "strip", z.ZodTypeAny, {
    token: string;
}, {
    token: string;
}>;
export declare const UpdateProfileSchema: z.ZodObject<{
    fullname: z.ZodString;
    email: z.ZodString;
    username: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
    fullname: string;
    username: string;
}, {
    email: string;
    fullname: string;
    username: string;
}>;
export declare const PhotoSchema: z.ZodObject<{
    image: z.ZodAny;
}, "strip", z.ZodTypeAny, {
    image?: any;
}, {
    image?: any;
}>;
export type ID = z.infer<typeof ParamsByIdSchema>;
export type Login = z.infer<typeof LoginSchema>;
export type Register = z.infer<typeof RegisterSchema>;
export type ForgotPassword = z.infer<typeof ForgotPasswordSchema>;
export type ResetPassword = z.infer<typeof ResetPasswordSchema>;
export type ChangePassword = z.infer<typeof ChangePasswordSchema>;
export type AddressWithOrderId = z.infer<typeof AddresSchema>;
export type AddressWithAddressId = z.infer<typeof AddressSchemaWithAddressId>;
export type QueryWithToken = z.infer<typeof QueryWithTokenSchema>;
export type UserAddress = z.infer<typeof UserAddressSchema>;
export type UpdateProfile = z.infer<typeof UpdateProfileSchema>;
export type Photo = z.infer<typeof PhotoSchema>;
export type Params = z.infer<typeof ParamsSchema>;
//# sourceMappingURL=user.schemaTypes.d.ts.map