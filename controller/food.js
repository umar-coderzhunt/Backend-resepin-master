const { foodModel } = require('../models/food')
const createError = require('http-errors')
const common = require('../helper/common')
const cloudinary = require('../helper/cloudinary')
// const path = require("path");
const foodController = {
  getFoods: (req, res, next) => {
    foodModel
      .getFood()
      .then((result) => {
        common.response(res, result, 'get data portfolio', 200)
      })
      .catch((error) => {
        console.log(error)
        next(createError)
      })
  },
  CreateFood: async (req, res, next) => {
    try {
      const gambarvid = req.files.video.map((file) => {
        return `http://${req.get('host')}/video/${file.filename}`
      })
      console.log(gambarvid)
      // console.log(req.files.image[0].filename);
      const gambars = req.files.image[0].path
      console.log(gambars)
      const ress = await cloudinary.uploader.upload(gambars, {
        folder: 'resepin'
      })
      // console.log(ress)

      const video = req.files.video[0].path
      console.log(video)
      const resVideo = await cloudinary.uploader.upload(video, {
        folder: 'resepin',
        resource_type: 'video'
      })
      console.log(resVideo)
      const { title, ingrediens } = req.body
      const data = {
        title,
        ingrediens,
        video: resVideo.url,
        image: ress.url
      }
      // console.log(
      //   `http://${req.get("host")}/video/${req.files.image[0].filename}`
      // );
      // console.log(cloudinary.uploader.upload(data.image))
      foodModel.insert({ ...data }).then(() => {
        common.response(res, data, 'data success create', 200)
      })
    } catch (error) {
      console.log(error)
      next(createError)
    }
  },
  getDetail: (req, res, next) => {
    const idfood = req.params.id
    foodModel
      .getDetail(idfood)
      .then((result) => {
        common.response(res, result, 'get detail data success', 200)
      })
      .catch((error) => {
        console.log(error)
        next(createError)
      })
  },
  updateFood: async (req, res, next) => {
    try {
      const gambarvid = req.files.video.map((file) => {
        return `http://${req.get('host')}/video/${file.filename}`
      })
      const gambars = req.files.image[0].path
      // console.log(req.file)
      const ress = await cloudinary.uploader.upload(gambars)
      // const gambar = JSON.stringify(gambarvid)
      const video = req.files.video[0].path
      const resVideo = await cloudinary.uploader.upload(video, {
        folder: 'resepin',
        resource_type: 'video'
      })
      console.log(gambarvid)
      const idfood = req.params.id
      const { title, ingrediens } = req.body
      const data = {
        title,
        ingrediens,
        video: resVideo.url,
        image: ress.url,
        idfood
      }
      foodModel
        .update(data, idfood)
        .then(() => {
          common.response(res, data, 'data updated success', 200)
        })
        .catch((error) => {
          console.log(error)
          next(createError)
        })
    } catch (error) {
      console.log(error)
      next(createError)
    }
  },
  deleteFood: (req, res, next) => {
    const idfood = req.params.id
    // const name = req.body.name
    foodModel
      .deleteFood(idfood)
      .then(() => {
        res.status(200).json({
          message: 'deleted success',
          data: `idfood : ${idfood}`
        })
      })
      .catch((error) => {
        console.log(error)
        next(createError)
      })
  },
  getFoodByFilter: async (req, res, next) => {
    try {
      const sort = req.query.sort
      const type = req.query.type
      const page = parseInt(req.query.page) || 1
      const limit = parseInt(req.query.limit) || 6
      const offset = (page - 1) * limit
      const search = req.query.search || ''
      console.log(search)
      console.log(offset)
      const result = await foodModel.filterFood({
        search,
        sort,
        type,
        limit,
        offset
      })
      const {
        rows: [count]
      } = await foodModel.countFood()
      const totalData = parseInt(count.total)
      const totalPage = Math.ceil(totalData / limit)
      const pagination = {
        currentPage: page,
        limit,
        totalData,
        totalPage
      }
      if (result.length === 0) {
        res.json({
          msg: 'data not found'
        })
      }
      common.response(
        res,
        result.rows,
        'get filter data success',
        200,
        pagination
      )
      // res.status(200).json({
      //   data: result.rows,
      //   pagination,
      // });
    } catch (error) {
      console.log(error)
      next(createError)
    }
  }
}

module.exports = {
  foodController
}
