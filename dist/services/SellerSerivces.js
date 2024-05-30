"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @Author Hrishikesh Rajan
 * Higher Level Class that depends for ISeller
 */
class SellerServices {
    createShop(repo, shop) {
        return repo.createShop(shop);
    }
    delete(repo, shopId) {
        return repo.delete(shopId);
    }
    deleteShopsByIds(repo, shopIds) {
        return repo.deleteShopsByIds(shopIds);
    }
    findById(repo, shopId) {
        return repo.findById(shopId);
    }
    findShopByOwnerId(repo, ownerId) {
        return repo.findShopByOwnerId(ownerId);
    }
    findShopsByOwnerId(repo, ownerId) {
        return repo.findShopsByOwnerId(ownerId);
    }
    editById(repo, shopId, details) {
        return repo.editById(shopId, details);
    }
    countTotalShopsBySellerId(repo, userId) {
        return repo.countTotalShopsBySellerId(userId);
    }
}
exports.default = SellerServices;
//# sourceMappingURL=SellerSerivces.js.map