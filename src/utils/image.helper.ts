import multer, { type StorageEngine } from 'multer'
import { type RequestHandler, type Request } from 'express'
import path from 'path'

import { type DataURI } from 'datauri/types'
import DataURIParser from 'datauri/parser'

import { type UploadedFile } from '../types/product'
const storage: StorageEngine = multer.memoryStorage()

/**
 * @description
 * The single or array method takes the name of the form field
 */
const multerUpload: RequestHandler = multer({ storage }).single('image')

const multerUploadArray: RequestHandler = multer({ storage }).array('images', 12)

const dUri: DataURIParser = new DataURIParser()

const convertToBase64 = (req: Request): string | undefined => {
  return dUri.format(path.extname(req.file?.originalname as string).toString(), req.file?.buffer as DataURI.Input).content
}

const convertToBase64Array = (item: UploadedFile[]): string[] => {
  const Base64Array: string[] = []
  item.forEach((item: UploadedFile) => {
    return Base64Array.push(dUri.format(path.extname(item.originalname).toString(), item.buffer as DataURI.Input).content as string)
  })
  return Base64Array
}

export { convertToBase64, multerUpload, multerUploadArray, convertToBase64Array }
