declare global {
    namespace Express {
      interface Request {
        user?:any
        cart?:any
      }
    }
}

export {}