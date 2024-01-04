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