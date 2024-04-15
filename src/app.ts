import app, { createDatabaseConnection } from './index'
const PORT = process.env.PORT_DEV ?? 4000

void createDatabaseConnection(process.env.MONGODB_URL as string).then(() => {
  app.listen(PORT, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`)
  })
}).catch((e) => { console.log(e) })
