const createError = require('http-errors')
const jwt = require('jsonwebtoken')
const protect = (req, res, next) => {
  try {
    // if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    //   token = req.headers.authorization.split(' ')[1]
    const token = req.cookies.token
    if (!token) {
      return next(createError(400, 'server need token'))
    }
    const decoded = jwt.verify(token, process.env.SECRET_KEY_JWT)
    // let decoded = jwt.verify(token, 'dsfasdfsdaf');
    // console.log(decoded);
    req.decoded = decoded
    next()
  } catch (error) {
    console.log(error)
    if (error && error.name === 'JsonWebTokenError') {
      next(createError(400, 'token invalid'))
    } else if (error && error.name === 'TokenExpiredError') {
      next(createError(400, 'token expired'))
    } else {
      next(createError(400, 'token not active'))
    }
  }
}
module.exports = {
  protect
}
