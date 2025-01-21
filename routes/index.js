const express = require('express')
const Router = express.Router()

const foodRouter = require('./food')
const auth = require('./auth')
const active = require('./activasi')
Router.use('/food', foodRouter)
  .use('/auth', auth)
  .use('http://localhost:4500/', active)
module.exports = Router
