"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryRepo = void 0;
const lodash_1 = require("lodash");
class CategoryRepo {
    category;
    constructor(categoryModel) {
        this.category = categoryModel;
    }
    /**
     * Create new category document
     */
    async create(values) {
        const category = await this.category.create(values);
        return category;
    }
    /**
      * Find category document
      */
    async getCategoryById(categoryId) {
        const category = await this.category.findById(categoryId);
        return category;
    }
    /**
      * Get all categorys
      */
    async getAll() {
        const categories = await this.category.find({});
        return categories;
    }
    /**
     *
     * @param {string} categoryId
     * @returns deleted document
     */
    async delete(categoryId) {
        const category = await this.category.findByIdAndDelete(categoryId);
        return category;
    }
    /**
     *
     * @param categoryId
     * @param fields
     * @returns updated document
     */
    async edit(categoryId, fields) {
        const category = await this.category.findById(categoryId);
        (0, lodash_1.merge)(category, fields);
        category?.modifiedPaths();
        const result = await category?.save();
        return result;
    }
}
exports.CategoryRepo = CategoryRepo;
//# sourceMappingURL=category.repository.js.map