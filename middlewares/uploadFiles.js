const createError = require('http-errors')
const multer = require('multer')
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '../public/video')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
    cb(null, file.fieldname + '-' + uniqueSuffix + '-' + file.originalname)
  }
})

const upload = multer({
  storage,
  limits: {
    fileSize: 1024 * 1024 * 30 // Accept files to 2mb only
  },
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype === 'image/png' ||
      file.mimetype === 'image/jpg' ||
      file.mimetype === 'video/mp4' ||
      file.mimetype === 'image/jpeg'
    ) {
      cb(null, true)
    } else {
      cb(null, false)
      return cb(createError(500, 'Image Allowed Only JPG/PNG'))
    }
  }
})

module.exports = upload
