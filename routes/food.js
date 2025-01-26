const express = require('express')
const Router = express.Router()
const { foodController } = require('../controller/food')
const uploadMultiple = require('../middlewares/uploadFile')
// const upload = require('../middlewares/uploadFiles')
// const { protect } = require('../middlewares/authEmployee')
const {
  register,
  activ,
  login,
  refreshToken,
  getProfil
} = require('../controller/auth')

Router.get('/', foodController.getFoods)
  .get('/filter/', foodController.getFoodByFilter)
  .get('/:id', foodController.getDetail)
  .post('/', uploadMultiple, foodController.CreateFood)
  .put('/:id', uploadMultiple, foodController.updateFood)
  .delete('/delete/:id', foodController.deleteFood)

module.exports = Router
