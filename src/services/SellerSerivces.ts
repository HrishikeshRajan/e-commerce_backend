import { ShopCore } from "@models/shopModel";
import { ISeller } from "types/ISeller.interface";

/**
 * @Author Hrishikesh Rajan
 * Higher Level Class that depends for ISeller 
 */
class SellerServices {


    createShop(repo: ISeller, shop: ShopCore) {
        return repo.createShop(shop);
    }

    delete(repo: ISeller, shopId: string) {
        return repo.delete(shopId);
    }

    deleteShopsByIds(repo: ISeller, shopIds: string[]) {
        return repo.deleteShopsByIds(shopIds);
    }

    findById(repo: ISeller, shopId: string) {
        return repo.findById(shopId);
    }

    findShopByOwnerId(repo: ISeller, ownerId: string) {
        return repo.findShopByOwnerId(ownerId);
    }

    findShopsByOwnerId(repo: ISeller, ownerId: string) {
        return repo.findShopsByOwnerId(ownerId);
    }

    editById(repo: ISeller, shopId: string, details: ShopCore) {
        return repo.editById(shopId, details);
    }

    countTotalShopsBySellerId(repo: ISeller, userId: string) {
        return repo.countTotalShopsBySellerId(userId);
    }
}

export default SellerServices;
