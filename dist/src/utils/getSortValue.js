"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSortValue = void 0;
const Sort = new Map();
Sort.set('latest', ['createdAt', 'desc']);
Sort.set('rating', ['ratings', 'desc']);
Sort.set('price_desc', ['price', 'desc']);
Sort.set('price_asc', ['price', 'asc']);
const getSortValue = (query) => {
    if (!query)
        return;
    const sort = {};
    const fields = Sort.get(query);
    sort[fields[0]] = fields[1];
    return sort;
};
exports.getSortValue = getSortValue;
//# sourceMappingURL=getSortValue.js.map