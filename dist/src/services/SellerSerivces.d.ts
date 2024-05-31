/// <reference types="mongoose/types/aggregate" />
/// <reference types="mongoose/types/callback" />
/// <reference types="mongoose/types/collection" />
/// <reference types="mongoose/types/connection" />
/// <reference types="mongoose/types/cursor" />
/// <reference types="mongoose/types/document" />
/// <reference types="mongoose/types/error" />
/// <reference types="mongoose/types/expressions" />
/// <reference types="mongoose/types/helpers" />
/// <reference types="mongoose/types/middlewares" />
/// <reference types="mongoose/types/indexes" />
/// <reference types="mongoose/types/models" />
/// <reference types="mongoose/types/mongooseoptions" />
/// <reference types="mongoose/types/pipelinestage" />
/// <reference types="mongoose/types/populate" />
/// <reference types="mongoose/types/query" />
/// <reference types="mongoose/types/schemaoptions" />
/// <reference types="mongoose/types/schematypes" />
/// <reference types="mongoose/types/session" />
/// <reference types="mongoose/types/types" />
/// <reference types="mongoose/types/utility" />
/// <reference types="mongoose/types/validation" />
/// <reference types="mongoose/types/virtuals" />
/// <reference types="mongoose" />
/// <reference types="mongoose/types/inferschematype" />
import { ShopCore } from "../models/shopModel";
import { ISeller } from "types/ISeller.interface";
/**
 * @Author Hrishikesh Rajan
 * Higher Level Class that depends for ISeller
 */
declare class SellerServices {
    createShop(repo: ISeller, shop: ShopCore): Promise<import("../models/shopModel").ShopDocument>;
    delete(repo: ISeller, shopId: string): Promise<import("../models/shopModel").ShopDocument | null>;
    deleteShopsByIds(repo: ISeller, shopIds: string[]): Promise<import("types/ISeller.interface").DeleteResult>;
    findById(repo: ISeller, shopId: string): Promise<import("../models/shopModel").ShopDocument | null>;
    findShopByOwnerId(repo: ISeller, ownerId: string): import("mongoose").Query<import("../models/shopModel").ShopDocument | null, import("../models/shopModel").ShopDocument, {}, import("../models/shopModel").ShopDocument>;
    findShopsByOwnerId(repo: ISeller, ownerId: string): Promise<import("../models/shopModel").ShopDocument[] | null>;
    editById(repo: ISeller, shopId: string, details: ShopCore): Promise<import("../models/shopModel").ShopDocument | null>;
    countTotalShopsBySellerId(repo: ISeller, userId: string): Promise<number>;
}
export default SellerServices;
//# sourceMappingURL=SellerSerivces.d.ts.map