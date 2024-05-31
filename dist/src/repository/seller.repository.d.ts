import { ShopCore, ShopDocument } from "../models/shopModel";
import { Model, Query } from "mongoose";
import { DeleteResult, ISeller } from "types/ISeller.interface";
declare class SellerRepository implements ISeller {
    shop: Model<ShopDocument>;
    constructor(shopModel: Model<ShopDocument>);
    /**
     * Creates a new shop document.
     *
     * @param shop - Shop data to create.
     * @returns Promise resolving to the created shop document as a plain JavaScript object.
     */
    createShop(shop: ShopCore): Promise<ShopDocument>;
    /**
      * Deletes a shop document by ID.
      *
      * @param shopId - ID of the shop to delete.
      * @returns Promise resolving to the deleted shop document (without full content) or null if not found.
      */
    delete(shopId: string): Promise<ShopDocument | null>;
    /**
      * Deletes multiple shop documents by IDs.
      *
      * @param shopsIds - Array of shop IDs to delete.
      * @returns Promise resolving to the deletion result containing information about deleted documents.
      */
    deleteShopsByIds(shopsIds: string[]): Promise<DeleteResult>;
    /**
      * Finds a shop document by ID.
      *
      * @param shopId - ID of the shop to find.
      * @returns Promise resolving to the found shop document or null if not found.
      */
    findById(shopId: string): Promise<ShopDocument | null>;
    /**
      * Finds a shop document by owner ID.
      *
      * @param ownerId - ID of the shop owner.
      * @returns Query object for filtering shops by owner ID (may be empty if no shops found).
      */
    findShopByOwnerId(ownerId: string): Query<ShopDocument | null, ShopDocument, {}, {}>;
    /**
     * Finds all shops belonging to a specific owner.
     *
     * @param ownerId - ID of the shop owner.
     * @returns Query object for filtering shops by owner ID (may be empty if no shops found).
     */
    findShopsByOwnerId(ownerId: string): Promise<ShopDocument[] | null>;
    /**
      * Updates a shop document with modified details, saving only the changed paths.
      *
      * @param shopId - ID of the shop to update.
      * @param details - Details containing updated fields for the shop.
      * @returns Promise resolving to the updated shop document or null if not found.
      */
    editById(shopId: string, details: ShopCore): Promise<ShopDocument | null>;
    countTotalShopsBySellerId(userId: string): Promise<number>;
}
export default SellerRepository;
//# sourceMappingURL=seller.repository.d.ts.map