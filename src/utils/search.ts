export default class Search {
  query: any
  method: any
  constructor (query: any, method?: any) {
    this.query = query
    this.method = method
  }

  search (): any {
    const searchWord = this.query.name.length > 0
      ? {
          name: {
            $regex: this.query.name,
            $options: 'i'
          }
        }
      : {}
    this.method = this.method.find({ ...searchWord })
    return this
  }

  filter (): any {
    const copyQ = { ...this.query }
    delete copyQ.name
    delete copyQ.limit
    delete copyQ.page

    let stringOfCopyQ = JSON.stringify(copyQ)
    stringOfCopyQ = stringOfCopyQ.replace(/\b(gte|lte|gt|lt)\b/g, (m) => `$${m}`)
    const jsonOfCopyQ = JSON.parse(stringOfCopyQ)
    this.method = this.method.find(jsonOfCopyQ)
    return this
  }

  pager (resultPerPage: number): any {
    let currentPage = 1
    if (this.method.page > 0) {
      currentPage = this.method.page
    }
    const skipVal = resultPerPage * (currentPage - 1)
    this.method = this.method.limit(resultPerPage).skip(skipVal)
    return this
  }
}
