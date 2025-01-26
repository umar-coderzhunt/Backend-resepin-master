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
        console.log("pp", error)
        next(createError)
      })
  },
  CreateFood: async (req, res, next) => {
    console.log("mama");

    try {
      // Prepare video URLs
      const gambarvid = req.files.video.map((file) => {
        return `http://${req.get('host')}/video/${file.filename}`;
      });
      console.log(gambarvid);

      // Upload image to Cloudinary
      const gambars = req.files.image[0].path;
      console.log(gambars);
      const ress = await cloudinary.uploader.upload(gambars, {
        folder: 'resepin',
      });

      // Upload video to Cloudinary
      const video = req.files.video[0].path;
      console.log(video);
      const resVideo = await cloudinary.uploader.upload(video, {
        folder: 'resepin',
        resource_type: 'video',
      });
      console.log(resVideo);

      // Prepare data
      const { title, ingrediens } = req.body;

      // Ensure `ingrediens` is an array
      const parsedIngrediens =
        typeof ingrediens === 'string' ? ingrediens.split(',') : ingrediens;

      const data = {
        title,
        ingrediens: parsedIngrediens, // Pass array to the model
        video: resVideo.url,
        image: ress.url,

      };

      // Insert into the database
      foodModel.insert({ ...data }).then(() => {
        common.response(res, data, 'data success create', 200);
      });
    } catch (error) {
      console.log(error);
      next(createError);
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
      const idfood = req.params.id;

      // Fetch the current food item details from the database
      const currentFood = await foodModel.getDetail(idfood);
      if (!currentFood || currentFood.length === 0) {
        return res.status(404).json({ error: "Food item not found." });
      }
      const existingData = currentFood[0];

      // Extract files
      const videoFile = req.files?.video?.[0];
      const imageFile = req.files?.image?.[0];

      // Upload new files if provided, otherwise retain old ones
      let videoUrl = existingData.video;
      let imageUrl = existingData.image;

      if (videoFile) {
        const videoPath = videoFile.path;
        const videoUpload = await cloudinary.uploader.upload(videoPath, {
          folder: "resepin",
          resource_type: "video",
        });
        videoUrl = videoUpload.url;
      }

      if (imageFile) {
        const imagePath = imageFile.path;
        const imageUpload = await cloudinary.uploader.upload(imagePath, {
          folder: "resepin",
        });
        imageUrl = imageUpload.url;
      }

      // Extract additional data from the request body
      const { title, ingrediens } = req.body;

      // Prepare the data to be updated
      const data = {
        title: title || existingData.title,
        ingrediens: ingrediens
          ? ingrediens.split(",")
          : existingData.ingrediens,
        video: videoUrl,
        image: imageUrl,
        idfood,
      };

      // Update the database
      await foodModel.update(data, idfood);
      common.response(res, data, "Data updated successfully.", 200);
    } catch (error) {
      console.error(error);
      next(createError(500, "Failed to update food item."));
    }
  },
  deleteFood: (req, res, next) => {
    console.log("ge");

    const idfood = req.params.id
    // const name = req.body.name
    console.log("tom", req.query, req.params);

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
