"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSearchSuggestions = void 0;
const product_repository_1 = require("@repositories/product.repository");
const CustomError_1 = __importDefault(require("@utils/CustomError"));
const productModel_1 = __importDefault(require("@models/productModel"));
const http_status_codes_1 = require("http-status-codes");
const response_services_1 = require("@services/response.services");
const fuse_js_1 = __importDefault(require("fuse.js"));
const node_cache_1 = __importDefault(require("node-cache"));
const product_services_1 = __importDefault(require("@services/product.services"));
const nodeCache = new node_cache_1.default();
/**
 * First checks on cache if not then fetch from database
 *
 * @param repo
 * @param productServce
 * @returns unique names and its frequency
 */
async function getItems(repo, productServce) {
    let cachedNames = nodeCache.get("names");
    if (cachedNames) {
        return cachedNames;
    }
    let result = await productServce.getUniqueProductNames(repo);
    nodeCache.set('names', result, 300);
    return result;
}
/**
 * API ACCESS: User
 * Sends keywords for suggestions
 * @param req
 * @param res
 * @param next
 * @returns void
 */
const getSearchSuggestions = async (req, res, next) => {
    try {
        const productRepo = new product_repository_1.ProductRepo(productModel_1.default);
        const productService = new product_services_1.default();
        let items = await getItems(productRepo, productService);
        const options = {
            useExtendedSearch: true,
            keys: ['name']
        };
        if (!items) {
            const response = {
                res,
                message: { suggestions: [] },
                statusCode: http_status_codes_1.StatusCodes.OK,
                success: true
            };
            return (0, response_services_1.sendHTTPResponse)(response);
        }
        const fuse = new fuse_js_1.default(items, options);
        const result = fuse.search(req.query.name);
        const selectedSuggestions = result.splice(1, 5);
        const response = {
            res,
            message: { suggestions: selectedSuggestions },
            statusCode: http_status_codes_1.StatusCodes.OK,
            success: true
        };
        (0, response_services_1.sendHTTPResponse)(response);
    }
    catch (error) {
        const errorObj = error;
        next(new CustomError_1.default(errorObj.message, errorObj.code, false));
    }
};
exports.getSearchSuggestions = getSearchSuggestions;
//# sourceMappingURL=searchSuggestionController.js.map