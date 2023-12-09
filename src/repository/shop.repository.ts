import { ShopCore, ShopDocument } from "@models/shopModel";
import { merge } from "lodash";
import { Model, Query, Document, Types } from "mongoose";

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
   * @param {T} shopId 
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
  /**
   * Saves the modified paths only
   * @param {T} shopId 
   * @returns mongoose document
   */
       async editById<T,D extends ShopCore>(shopId: T, details:D): Promise< ShopDocument | null> {
          const shop = await this.shop.findById(shopId)
          merge(shop,details)
          shop?.modifiedPaths()
          await shop?.save()
          return shop ?? null
        }
}


export default ShopRepository;

