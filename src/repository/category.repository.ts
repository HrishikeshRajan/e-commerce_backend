import { CategoryCore, CategoryDocument } from "@models/categoryModel";
import { merge } from "lodash";
import { Model } from "mongoose";

export class CategoryRepo {

   category: Model<CategoryDocument>;
   constructor(categoryModel: Model<CategoryDocument>) {
      this.category = categoryModel;
   }


   /**
    * Create new category document
    */
   async create(values: CategoryCore) {
      const category = await this.category.create(values)
      return category
   }

   /**
     * Find category document
     */
   async getCategoryById(categoryId: string) {
      const category = await this.category.findById(categoryId)
      return category
   }

   /**
     * Get all categorys
     */
      async getAll() {
         const categories = await this.category.find({})
         return categories
      }

   /**
    * 
    * @param {string} categoryId 
    * @returns deleted document
    */
   async delete(categoryId: string) {
      const category = await this.category.findByIdAndDelete(categoryId)
      return category
   }


   /**
    * 
    * @param categoryId 
    * @param fields 
    * @returns updated document
    */
   async edit(categoryId: string, fields: CategoryCore) {
      const category = await this.category.findById(categoryId)
      merge(category, fields)
      category?.modifiedPaths()
      const result = await category?.save()
      return result
   }

}