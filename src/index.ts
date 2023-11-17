import express, { type Express } from 'express'
import dotenv from 'dotenv'

import userRouter from './routes/userRouter'
import productRouter from './routes/productRouter'
import adminRouter from './routes/adminRouter'
import { errorHandler } from './middlewares/error.handler'
import cookieParser from 'cookie-parser'
import cloudinaryConfig from './configs/cloudinary.config'
import session from 'express-session'
import DatabaseService from './services/database.services'
import DatabaseSingleton from './configs/databaseSingleton.config'
import deserializeUser from './middlewares/deserializeUser'
import compress from 'compression'
import helmet from 'helmet'
import cors from 'cors'

dotenv.config()
dotenv.config({ path: '.env.test' })

const app: Express = express()

// Middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(session({
  resave: false,
  saveUninitialized: false,
  secret: process.env.SESSION_SECRET_DEV as string

}))

app.use(compress())
app.use(helmet())
app.use(cors({
  origin: process.env.FRONTEND_URL as string,
  credentials: true
}))

// In this step, cloudinary is configured for all routes
app.use('*', cloudinaryConfig)
app.use(deserializeUser)

// Route middlewares
app.use('/api/v1/users/', userRouter)
app.use('/api/v1/product/', productRouter)
app.use('/api/v1/admin/', adminRouter)

export const createDatabaseConnection = async (url: string): Promise<void> => {
  const databaseService = new DatabaseService()

  // eslint-disable-next-line @typescript-eslint/no-confusing-void-expression
  await databaseService.connectDatabase(DatabaseSingleton.getInstance(), url)
}

app.use(errorHandler)

export default app
