const createError = require('http-errors')
const jwt = require('jsonwebtoken')
const protect = (req, res, next) => {
  try {
    console.log("protectttt");
    let token
    // if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    //   token = req.headers.authorization.split(' ')[1]
    // const token = req.token

    const tokens = req.headers.cookie.match(/token=([^;]+)/);
    if (tokens) {
      token = tokens[1]; // Return the captured token
    } else {
      throw new Error('Token not found in the cookie string');
    }
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
