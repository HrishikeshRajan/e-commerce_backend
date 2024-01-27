import { SortOrder } from "mongoose"

const Sort = new Map()
Sort.set('latest', ['createdAt', 'desc'])
Sort.set('rating', ['ratings', 'desc'])
Sort.set('price_desc', ['price', 'desc'])
Sort.set('price_asc', ['price', 'asc'])

export const getSortValue = (query: string) => {
    if (!query) return
    const sort: { [key: string]: SortOrder } = {

    }
    const fields = Sort.get(query)
    sort[fields[0]] = fields[1]
    return sort;
}