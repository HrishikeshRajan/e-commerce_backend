/* eslint-disable @typescript-eslint/no-misused-promises */

import express, { type Express, type Request, type Response } from 'express'
import dotenv from 'dotenv'


import userRouter from '@routes/userRouter'
import productRouter from '@routes/productRouter'
import adminRouter from '@routes/adminRouter'
import sellerRouter from '@routes/sellerRouter'
import { errorHandler, notFound, productionErrorHandler } from './middlewares/error.handler'
import cookieParser from 'cookie-parser'
import cloudinaryConfig from './configs/cloudinary.config'
import session from 'express-session'
import DatabaseService from './services/database.services'
import DatabaseSingleton from './configs/databaseSingleton.config'
import deserializeUser from './middlewares/deserializeUser'
import compress from 'compression'
import helmet from 'helmet'
import cors from 'cors'
import 'module-alias/register'
dotenv.config()
dotenv.config({ path: '.env.test' })

const app: Express = express()


app.use(cors({
  origin: true,
  credentials: true
}))

app.use(compress())
app.use(helmet())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(session({
  resave: false,
  saveUninitialized: false,
  secret: process.env.SESSION_SECRET_DEV as string

}))

//Here we configure the cloudinary keys
app.use('*', cloudinaryConfig)

//Here we handle the JWT token validation
app.use(deserializeUser)


// Cloudinary is configured for all routes
// app.engine('handlebars', engine())
// app.set('view engine', 'handlebars')
// app.set('views', './src/views')
// app.use(express.static(path.join(__dirname, '/src/public')))

// Route API
app.use('/api/v1/users/', userRouter)
app.use('/api/v1/product/', productRouter)
app.use('/api/v1/admin/', adminRouter)
app.use('/api/v1/seller/', sellerRouter)

// This will catch the unmatched routes and forward to error handler 
app.use(notFound)

export const createDatabaseConnection = async (url: string): Promise<void> => {
  const databaseService = new DatabaseService()
  // eslint-disable-next-line @typescript-eslint/no-confusing-void-expression
  await databaseService.connectDatabase(DatabaseSingleton.getInstance(), url)
}

/* 
  Here we handle production error
*/
if(process.env.NODE_ENV === 'production'){
  app.use(productionErrorHandler)
}

app.use(errorHandler)

export default app
