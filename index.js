require('dotenv').config()
const express = require('express')
const helmet = require('helmet')
const xss = require('xss-clean')
const CreateError = require('http-errors')
const morgan = require('morgan')
const cors = require('cors')
const path = require('path')
const Router = require('./routes/index')
const { activ } = require('./controller/auth')
const app = express()
app.use(express.json())
app.use(morgan('dev'))
app.use(cors())
app.use(helmet())

helmet({
  crossOriginResourcePolicy: false
})
app.use(xss())
app.disable('x-powered-by')
const PORT = process.env.PORT || 6000

app.use('/', Router)
app.use(`http://localhost:${PORT}/auth/activasi/:token`, activ)
app.use('/img', express.static(path.join(__dirname, './public/images')))
app.use('/video', express.static(path.join(__dirname, './public/video')))

console.log("PORT", PORT)
app.listen(PORT, () => {
  console.log(`example app listening at http://localhost:${PORT}`)
})
app.all('*', (req, res, next) => {
  next(new CreateError.NotFound())
})

app.use((err, req, res, next) => {
  const messError = err.message || 'internal server error'
  const statusCode = err.status || 500

  res.status(statusCode).json({
    message: messError
  })
})
