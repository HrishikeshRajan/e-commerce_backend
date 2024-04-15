"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const getSortValue_1 = require("./getSortValue");
//Q for custom query
//M for mongoose document model
/**
 * @author Hrishikesh Rajan
 * @constructor
 * @param {Model} model Your mongoose model
 * @param {FilterQuery} customQuery the query you want to execute
 */
class SearchEngine {
    model;
    customQuery;
    query;
    constructor(model, customQuery) {
        this.model = model;
        this.customQuery = customQuery;
        this.query = undefined;
    }
    search() {
        const searchWord = this.customQuery.name ? {
            name: { $regex: this.customQuery.name, $options: 'i' }
        } : {};
        this.query = this.model.find({
            ...searchWord
        });
        return this;
    }
    customSearch() {
        const searchWord = this.customQuery.name ? this.customQuery : {};
        this.query = this.model.find({
            ...searchWord
        });
        return this;
    }
    filter() {
        const copyQuery = structuredClone(this.customQuery);
        //Deletes unneccessary fields
        copyQuery.limit && delete copyQuery.limit;
        copyQuery.sort && delete copyQuery.sort;
        copyQuery.page && delete copyQuery.page;
        //Add $ symbols before lt,lte,gt,gte 
        let copyQueryString = JSON.stringify(copyQuery);
        copyQueryString = copyQueryString.replace(/\b(lt|lte|gt|gte)\b/g, ((val) => `$${val}`));
        const queryObject = JSON.parse(copyQueryString);
        this.query = this.query?.find(queryObject);
        return this;
    }
    sort() {
        if (!this.customQuery?.sort)
            return this;
        const sortObj = (0, getSortValue_1.getSortValue)(this.customQuery.sort);
        this.query = this.query?.sort(sortObj);
        return this;
    }
    pager(resultPerPage, total) {
        let page = this.customQuery.page ? parseInt(this.customQuery.page) : 1;
        const skip = resultPerPage * (page - 1);
        if (skip > total) {
            return -1;
        }
        this.query = this.query?.limit(resultPerPage).skip(skip);
        return this;
    }
}
exports.default = SearchEngine;
//# sourceMappingURL=SearchEngine.js.map