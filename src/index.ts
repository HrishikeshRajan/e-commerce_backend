/* eslint-disable @typescript-eslint/no-misused-promises */

import express, { type Express } from 'express'
import dotenv from 'dotenv'


import userRouter from '@routes/userRouter'
import productRouter from '@routes/productRouter'
import adminRouter from '@routes/adminRouter'
import sellerRouter from '@routes/sellerRouter'
import cartRouter from '@routes/cartRouter'
import orderRouter from '@routes/orderRouter'
import reviewRouter from '@routes/reviewRouter'
import { errorHandler, errorHandlerV2, notFound, productionErrorHandler } from './middlewares/error.handler'
import cookieParser from 'cookie-parser'
import cloudinaryConfig from './configs/cloudinary.config'
import session from 'express-session'
import DatabaseService from './services/database.services'
import DatabaseSingleton from './configs/databaseSingleton.config'
// import deserializeUser from './middlewares/deserializeUser'
import compress from 'compression'
import helmet from 'helmet'
import cors, { CorsOptions } from 'cors'
import morgan from 'morgan'


import 'module-alias/register'
dotenv.config()
dotenv.config({ path: '.env.test' })

const app: Express = express()

app.use(morgan('tiny'))
// const whitelist = (process.env.WHITELIST_URL as string).split(';')


// const corsOptions: CorsOptions = {
//   origin: (origin: string | undefined, callback: (err: Error | null, status?: boolean) => void) => {
//     if (!origin || whitelist.indexOf(origin) !== -1) {
//       callback(null, true);
//     } else {
//       callback(new Error('Not allowed by CORS'));
//     }
//   },
//   credentials: true,
// };


app.use(cors({
  origin:true,
  credentials: true
}))


app.use(compress())
app.use(helmet())
app.use(
  express.json({
    verify: function (req, res, buf) {
      if (req.originalUrl?.endsWith('/webhook')) {
        req.rawBody = buf.toString();
      }
    },
  }),
);

// app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(session({
  resave: false,
  saveUninitialized: false,
  secret: process.env.SESSION_SECRET_DEV as string

}))

//Here we configure the cloudinary keys
app.use('*', cloudinaryConfig)

//Here we handle the JWT token validation
// app.use(deserializeUser)


// Cloudinary is configured for all routes
// app.engine('handlebars', engine())
// app.set('view engine', 'handlebars')
// app.set('views', './src/views')
// app.use(express.static(path.join(__dirname, '/src/public')))

// app.enable('trust proxy');
// Route API
app.use('/api/v1/users/', userRouter)
app.use('/api/v1/product/', productRouter)
app.use('/api/v1/admin/', adminRouter)
app.use('/api/v1/seller/', sellerRouter)
app.use('/api/v1/cart/', cartRouter)
app.use('/api/v1/orders/', orderRouter)
app.use('/api/v1/review/', reviewRouter)

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
// if(process.env.NODE_ENV === 'production'){
//   app.use(errorHandlerV2)
// }

// app.use(errorHandler)
app.use(errorHandlerV2)
export default app
