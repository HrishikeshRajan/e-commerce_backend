import { ShopCore, ShopDocument } from "@models/shopModel";
import { Model } from "mongoose";

class ShopRepository {
  shop: Model<ShopDocument>;
  constructor(shopModel: Model<ShopDocument>) {
    this.shop = shopModel;
  }

  /**
   * @param {ShopCore} shop 
   * @returns Shop document as plain javascript object
   */
  async create<T>(shop: T): Promise<T> {
    return (await this.shop.create(shop)).toObject()
  }
  
  /**
   * @param {string} shopId 
   * @returns true if deleted else false
   */
  async delete<T>(shopId: T): Promise<boolean> {
    const isDeleted = await this.shop.findByIdAndDelete(shopId)
    return isDeleted ? true : false
  }
}


export default ShopRepository;