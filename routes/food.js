const express = require('express')
const Router = express.Router()
const { foodController } = require('../controller/food')
const uploadMultiple = require('../middlewares/uploadFile')
// const upload = require('../middlewares/uploadFiles')
// const { protect } = require('../middlewares/authEmployee')

Router.get('/', foodController.getFoods)
  .get('/filter/', foodController.getFoodByFilter)
  .get('/:id', foodController.getDetail)
  .post('/', uploadMultiple, foodController.CreateFood)
  .put('/:id', uploadMultiple, foodController.updateFood)
  .delete('/:id', foodController.deleteFood)

module.exports = Router
