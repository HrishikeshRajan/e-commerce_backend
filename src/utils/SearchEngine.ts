
import { Query, FilterQuery, Model } from "mongoose";


//Generic Query Type
type QueryType<X> = Query<X[] | null, X, {}, X>

//Q for custom query
//M for mongoose document model

/**
 * @author Hrishikesh Rajan
 * @constructor
 * @param {Model} model Your mongoose model
 * @param {FilterQuery} customQuery the query you want to execute
 */
class SearchEngine<M, Q> {
    model: Model<M>
    customQuery: FilterQuery<Q>
    query: QueryType<M> | undefined


    constructor(model: Model<M>, customQuery: FilterQuery<Q>) {
        this.model = model
        this.customQuery = customQuery;
        this.query = undefined
    }

    search() {

        const searchWord = this.customQuery.name ? {
            name: new RegExp("^" + this.customQuery.name, "i")
        } : {}
        this.query = this.model.find({
            ...searchWord
        })
        return this
    }
    customSearch() {

        const searchWord = this.customQuery.name ? this.customQuery : {}
        this.query = this.model.find({
            ...searchWord
        })
        return this
    }


    filter() {
        const copyQuery = structuredClone(this.customQuery)
        //Deletes unneccessary fields
        copyQuery.limit && delete copyQuery.limit
        copyQuery.sort && delete copyQuery.sort
        copyQuery.page && delete copyQuery.page

        //Add $ symbols before lt,lte,gt,gte 
        let copyQueryString = JSON.stringify(copyQuery)
        copyQueryString = copyQueryString.replace(/\b(lt|lte|gt|gte)\b/g, ((val) => `$${val}`))
        const queryObject = JSON.parse(copyQueryString)

        this.query = this.query?.find(queryObject)
        return this;
    }

    pager(resultPerPage: number, total: number) {
        let page = this.customQuery.page ? parseInt(this.customQuery.page) : 1
        const skip = resultPerPage * (page - 1)
console.log(skip,total)
        if (skip > total) {
            return -1
        }
        this.query = this.query?.limit(resultPerPage).skip(skip)
        return this;
    }

}

export default SearchEngine