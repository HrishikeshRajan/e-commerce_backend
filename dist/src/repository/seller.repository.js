"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
class SellerRepository {
    shop;
    constructor(shopModel) {
        this.shop = shopModel;
    }
    /**
     * Creates a new shop document.
     *
     * @param shop - Shop data to create.
     * @returns Promise resolving to the created shop document as a plain JavaScript object.
     */
    async createShop(shop) {
        return (await this.shop.create(shop)).toObject();
    }
    /**
      * Deletes a shop document by ID.
      *
      * @param shopId - ID of the shop to delete.
      * @returns Promise resolving to the deleted shop document (without full content) or null if not found.
      */
    async delete(shopId) {
        const isDeleted = await this.shop.findByIdAndDelete(shopId).select('name _id');
        return isDeleted;
    }
    /**
      * Deletes multiple shop documents by IDs.
      *
      * @param shopsIds - Array of shop IDs to delete.
      * @returns Promise resolving to the deletion result containing information about deleted documents.
      */
    async deleteShopsByIds(shopsIds) {
        const result = await this.shop.deleteMany({ _id: { $in: shopsIds } });
        return result;
    }
    /**
      * Finds a shop document by ID.
      *
      * @param shopId - ID of the shop to find.
      * @returns Promise resolving to the found shop document or null if not found.
      */
    async findById(shopId) {
        const shop = await this.shop.findById(shopId);
        return shop ?? null;
    }
    /**
      * Finds a shop document by owner ID.
      *
      * @param ownerId - ID of the shop owner.
      * @returns Query object for filtering shops by owner ID (may be empty if no shops found).
      */
    findShopByOwnerId(ownerId) {
        const shop = this.shop.findOne({ owner: ownerId });
        return shop ?? null;
    }
    /**
     * Finds all shops belonging to a specific owner.
     *
     * @param ownerId - ID of the shop owner.
     * @returns Query object for filtering shops by owner ID (may be empty if no shops found).
     */
    async findShopsByOwnerId(ownerId) {
        const shops = await this.shop.find({ owner: ownerId });
        return shops;
    }
    /**
      * Updates a shop document with modified details, saving only the changed paths.
      *
      * @param shopId - ID of the shop to update.
      * @param details - Details containing updated fields for the shop.
      * @returns Promise resolving to the updated shop document or null if not found.
      */
    async editById(shopId, details) {
        const shop = await this.shop.findById(shopId);
        (0, lodash_1.merge)(shop, details);
        shop?.modifiedPaths();
        await shop?.save();
        return shop ?? null;
    }
    /* Counts the total number of shops for a specific seller (identified by ID).
     *
     * @param userId - ID of the seller.
     * @returns Promise resolving to the total number of shops for the seller.
     */
    async countTotalShopsBySellerId(userId) {
        const result = await this.shop.countDocuments({ owner: userId });
        return result;
    }
}
exports.default = SellerRepository;
//# sourceMappingURL=seller.repository.js.map