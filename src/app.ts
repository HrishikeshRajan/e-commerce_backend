import app from './index'
const PORT = process.env.PORT_DEV ?? 4000

app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`)
})

