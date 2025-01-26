const bcrypt = require('bcryptjs')
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken')
const createError = require('http-errors')
const {
  findByEmail,
  create,
  changePassword,
  getprofile,
  activasi, updateProfile
} = require('../models/auth')
const commonHelper = require('../helper/common')
const authHelper = require('../helper/authEmployee')
const { sendMail } = require('../helper/sendEmail')


const register = async (req, res, next) => {
  try {
    const { fullname, email, phonenumber, password } = req.body;

    // Check if the email already exists
    const { rowCount } = await findByEmail(email);

    if (rowCount) {
      return next(new Error('User already exists'));
    }

    // Generate a hashed password
    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(password, salt);

    // Generate a unique ID for the user
    const data = {
      iduser: uuidv4(),
      fullname,
      email,
      phonenumber,
      password: passwordHash,
    };


    // Save the user to the database
    const val = await create(data);
    sendMail({ email, fullname })
    return res.status(201).json({ message: 'User successfully registered', data });
  } catch (error) {
    console.log(error);

    return res.status(500).json({ message: 'User successfully registered', error });

    next(error);
  }
};

const activ = async (req, res, next) => {
  try {
    const token = req.params.token
    const decoded = await jwt.verify(token, process.env.SECRET_KEY_JWT)
    console.log("decoded", decoded)
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
    res.redirect('http://localhost:3000/login')
  } catch (error) {
    console.log(error)
    next(createError)
  }
}
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body
    console.log(req.body);

    const {
      rows: [user]
    } = await findByEmail(email)
    if (!user) {
      return commonHelper.response(
        res,
        null,
        'your email or password is incorrect',
        403
      )
    }
    // if (user.active === '0') {
    //   return res.json({
    //     message: ' anda belum verifikasi'
    //   })
    // }
    console.log("NAdaaaa");

    const validPassword = bcrypt.compareSync(password, user.password)
    if (!validPassword) {
      return commonHelper.response(
        res,
        null,
        'your email or password is incorrect',
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
    console.log("getProfile", req.decoded?.id);

    const userId = req.decoded?.id;
    if (!userId) {
      return res.status(400).json({ message: "Invalid token or user ID." });
    }

    const profile = await getprofile(userId);
    console.log("profile", profile);

    if (!profile) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json({ status: "success", data: profile });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch profile.", error });
  }
};

const updateUser = async (req, res, next) => {
  try {
    console.log('Uploaded File:', req.file);
    console.log('Request Body:', req.body);

    const { fullname, email } = req.body;
    let avatar = null;

    // Check if a file is uploaded and get its local path
    if (req.file) {
      avatar = `/uploads/${req.file.filename}`;
    }

    // Prepare data for the database
    const data = {
      fullname,
      email,
      avatar, // Optional: Save avatar path only if it exists
    };

    // Update the user profile in the database
    const dd = await updateProfile(data);
    console.log("Mama", dd);

    // Send a success response
    res.status(200).json({ message: 'Profile updated successfully', data });
  } catch (error) {
    console.error('Error in updateUser:', error);
    next(createError(500, 'Failed to update profile'));
  }
};


module.exports = {
  register,
  login,
  refreshToken,
  changePasswordEmployee,
  getProfil,
  activ, updateUser
}
