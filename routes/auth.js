const express = require('express')
const Router = express.Router()
const multer = require('multer');
const path = require('path');
const {
  register,
  activ,
  login,
  refreshToken,
  getProfil, updateUser
} = require('../controller/auth')
const { protect } = require('../middlewares/authEmployee')
// Configure Multer for File Uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, './public/uploads')); // Destination folder for uploads
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname)); // Append the file extension
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 1024 * 1024 * 30, // Max file size: 30 MB
  },
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = ['image/png', 'image/jpg', 'image/jpeg', 'video/mp4'];
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error('Allowed file types: JPG, PNG, MP4'));
    }
  },
});
// Configure storage for uploaded files
Router.get('/profil', protect, getProfil)
  .get('/activasi/:token', activ)
  .post('/register', register)
  .post('/login', login)
  .post('/refresh-token', refreshToken)
  .put(
    '/update/:id',
    upload.single('image'), // Middleware for handling file upload
    updateUser
  );

module.exports = Router
