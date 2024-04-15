import { type RequestHandler } from 'express';
import { GenericRequest } from 'types/IUser.interfaces';
/**
 * @description
 * The single or array method takes the name of the form field
 */
declare const multerUpload: RequestHandler;
declare const multerUploadArray: RequestHandler;
declare const convertToBase64: (req: GenericRequest<{}, {}, {}>) => string | undefined;
declare const convertToBase64Array: (item: any) => string[];
export { convertToBase64, multerUpload, multerUploadArray, convertToBase64Array };
//# sourceMappingURL=image.helper.d.ts.map