const express = require('express')
const Router = express.Router()

const {
  activ
} = require('../controller/auth')

Router.get('login/:token', activ)

module.exports = Router
