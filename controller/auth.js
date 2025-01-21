const bcrypt = require('bcryptjs')
const { v4: uuidv4 } = require('uuid')
const jwt = require('jsonwebtoken')
const createError = require('http-errors')
const {
  findByEmail,
  create,
  changePassword,
  getprofil,
  activasi
} = require('../models/auth')
const commonHelper = require('../helper/common')
const authHelper = require('../helper/authEmployee')
const { sendMail } = require('../helper/sendEmail')

const register = async (req, res, next) => {
  try {
    const { fullname, email, phonenumber, password } = req.body
    console.log("Here")
    const { rowCount } = await findByEmail(email)

    const salt = bcrypt.genSaltSync(10)
    const passwordHash = bcrypt.hashSync(password, salt)

    if (rowCount) {
      return next(createError(403, 'user sudah terdaftar'))
    }
    const data = {
      iduser: uuidv4(),
      fullname,
      email,
      phonenumber,
      password: passwordHash
    }
    console.log("Here2")
    sendMail({ email, fullname })
    console.log("Here3")
    await create(data)
    commonHelper.response(res, data, 'User berhasil register', 200)
  } catch (error) {
    console.log("Error is", error)
    next(createError())
  }
}
const activ = async (req, res, next) => {
  try {
    const token = req.params.token
    const decoded = await jwt.verify(token, process.env.SECRET_KEY_JWT)
    console.log(decoded)
    const data = {
      active: 1,
      email: decoded.email,
      role: decoded.role
    }

    await activasi(data)
    const newPayload = {
      email: decoded.email,
      name: decoded.fullname,
      role: decoded.role
    }
    console.log(newPayload)
    // const newRefreshToken = await authHelper.generateRefreshToken(newPayload)
    if (decoded.status === '1') {
      return res.json({ message: 'akun anda sudah terverifikasi' })
    }
    res.redirect('https://resepin-aja.vercel.app/login')
  } catch (error) {
    console.log(error)
    next(createError)
  }
}
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body
    const {
      rows: [user]
    } = await findByEmail(email)
    if (!user) {
      return commonHelper.response(
        res,
        null,
        'email atau password anda salah',
        403
      )
    }
    // if (user.active === '0') {
    //   return res.json({
    //     message: ' anda belum verifikasi'
    //   })
    // }

    const validPassword = bcrypt.compareSync(password, user.password)
    if (!validPassword) {
      return commonHelper.response(
        res,
        null,
        'email atau password anda salah',
        403
      )
    }
    delete user.password

    const payload = {
      fullname: user.fullname,
      email: user.email,
      id: user.iduser,
      status: user.active
    }

    user.token = authHelper.generateToken(payload)
    user.refreshToken = authHelper.generateRefreshToken(payload)
    // console.log(user)
    res.cookie('token', user.token, {
      httpOnly: true,
      maxAge: 60 * 1000 * 60 * 12,
      secure: process.env.NODE_ENV !== 'Development',
      path: '/',
      sameSite: 'strict'
    })
    return commonHelper.response(res, user, 'anda berhasil login', 201)
  } catch (error) {
    console.log(error)
    next(new createError.InternalServerError())
  }
}

const refreshToken = (req, res, next) => {
  const refreshToken = req.body.refreshToken
  const decoded = jwt.verify(refreshToken, process.env.SECRET_KEY_JWT2)
  const payload = {
    email: decoded.email,
    role: decoded.role
  }
  const result = {
    token: authHelper.generateToken(payload),
    refreshToken: authHelper.generateRefreshToken(payload)
  }
  commonHelper.response(res, result, 'token berhasil', 200)
}

const changePasswordEmployee = (req, res, next) => {
  changePassword(req.body)
    .then(() => {
      res.json({
        message: 'password has been changed'
      })
    })
    .catch((err) => {
      console.log(err)
    })
}

const getProfil = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1]
    const decoded = jwt.verify(token, process.env.SECRET_KEY_JWT)
    const idusers = decoded.id
    console.log(idusers)
    const result = await getprofil(idusers)

    commonHelper.response(res, result.rows, 'Get profil data success', 200)
  } catch (error) {
    console.log(error)
    next(createError)
  }
}
module.exports = {
  register,
  login,
  refreshToken,
  changePasswordEmployee,
  getProfil,
  activ
}
