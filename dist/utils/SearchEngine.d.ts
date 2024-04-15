import { Query, FilterQuery, Model } from "mongoose";
type QueryType<X> = Query<X[] | null, X, {}, X>;
/**
 * @author Hrishikesh Rajan
 * @constructor
 * @param {Model} model Your mongoose model
 * @param {FilterQuery} customQuery the query you want to execute
 */
declare class SearchEngine<M, Q> {
    model: Model<M>;
    customQuery: FilterQuery<Q>;
    query: QueryType<M> | undefined;
    constructor(model: Model<M>, customQuery: FilterQuery<Q>);
    search(): this;
    customSearch(): this;
    filter(): this;
    sort(): this;
    pager(resultPerPage: number, total: number): -1 | this;
}
export default SearchEngine;
//# sourceMappingURL=SearchEngine.d.ts.map