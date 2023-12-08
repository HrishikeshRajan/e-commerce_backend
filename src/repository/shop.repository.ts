import { ShopCore, ShopDocument } from "@models/shopModel";
import { Model, Query, Document } from "mongoose";

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
  
  /**
   * @param {string} shopId 
   * @returns the document if exists else null
   */

    async findById<T>(shopId: T): Promise<ShopDocument | null> {
      const shop = await this.shop.findById(shopId)
      return shop ?? null
    }
  /**
   * @param {T} ownerId 
   * @returns a query object if exists else null
   */
       findShopByOwnerId<T>(ownerId: T): Query< ShopDocument | null, ShopDocument,{},{}> {
        const shop = this.shop.findOne({owner:ownerId})
      
        return shop ?? null
      }
}


export default ShopRepository;

