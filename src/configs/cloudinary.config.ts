import cloudinary from 'cloudinary'
import { type Request, type RequestHandler, type Response, type NextFunction } from 'express'

const cloudinaryConfig: RequestHandler = (req: Request, res: Response, next: NextFunction): void => {
  cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  })
  next()
}

export default cloudinaryConfig
