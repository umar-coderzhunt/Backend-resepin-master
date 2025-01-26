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
// app.all('http://localhost:3000/', (req, res, next) => {
//   next(new CreateError.NotFound())
// })
const corsOptions = {
  origin: 'http://localhost:3000', // Allow requests from this origin
  credentials: true,              // Allow credentials (cookies, authorization headers)
};
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

app.use(cors(corsOptions));
app.use((err, req, res, next) => {
  const messError = err.message || 'internal server error'
  const statusCode = err.status || 500

  res.status(statusCode).json({
    message: messError
  })
})
