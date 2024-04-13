import { ShopCore, ShopDocument } from "@models/shopModel";
import { Query } from "mongoose";

export interface ShopQuery {
    name?: string;
    category?: string;
    email?:string;
    owner?:string;
    ratings?:string;
    created?:string;
    description?:string;
    sort?: string;
    limit?: string;
    page?: string;
  }

  export interface DeleteResult {
    n?: number; 
    ok?: number;
    deletedCount: number;
  }

/**
 * Abstraction for Seller Repo and Seller Services
 */
 export interface ISeller {
    create(shop: ShopCore): Promise<ShopDocument>;
    delete(shopId: string): Promise<ShopDocument | null>;
    deleteShopsByIds(shopsIds: string[]): Promise<DeleteResult>;
    findById(shopId: string): Promise<ShopDocument | null>;
    findShopByOwnerId(ownerId: string): Query<ShopDocument | null, ShopDocument, {}>;
    findShopsByOwnerId(ownerId: string): Query<ShopDocument[] | null, ShopDocument, {}>;
    editById(shopId: string, details: ShopCore): Promise<ShopDocument | null>;
    countTotalShopsBySellerId(userId: string): Promise<number>;
  }
  