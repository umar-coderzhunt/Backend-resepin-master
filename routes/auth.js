const express = require('express')
const Router = express.Router()

const {
  register,
  activ,
  login,
  refreshToken,
  getProfil
} = require('../controller/auth')
const { protect } = require('../middlewares/authEmployee')

Router.get('/profil', protect, getProfil)
  .get('/activasi/:token', activ)
  .post('/register', register)
  .post('/login', login)
  .post('/refresh-token', refreshToken)

module.exports = Router
