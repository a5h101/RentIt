const User = require('../models/usersModel');
const Product = require('../models/productsModel');
const { OAuth2Client } = require('google-auth-library');

exports.userLogin = async (req, res) => {
  let [token, validToken] = [false, false];
  console.log('login');

  const client = new OAuth2Client(process.env.CLIENT_ID);

  const verifyToken = async (access_token) => {
    try {
      const tokenInfo = await client.getTokenInfo(access_token);
      return tokenInfo.email_verified;
    } catch (error) {
      console.error('Error verifying access token:', error);
      return null;
    }
  };

  if (req.headers.authorization) {
    token = req.headers.authorization.split(' ')[1];
    validToken = await verifyToken(token);
  }

  if (validToken) {
    try {
      const existingUser = await User.findOne({ sub: req.body.sub });
      if (existingUser) {
        existingUser.access_token = req.headers.authorization.split(' ')[1];
        await existingUser.save();
        return res.status(200).json({
          status: 'sucess',
          message: 'Loggedin sucessfully',
          data: {
            _id: existingUser._id,
            access_token: existingUser.access_token,
          },
        });
      }
      const newUser = await User.create(req.body);
      res.status(201).json({
        status: 'sucess',
        data: {
          users: newUser,
          _id: newUser._id,
        },
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        status: 'fail',
        message: `there is error:${err}`,
      });
    }
  } else {
    res.status(401).json({
      status: 'fail',
      message: `Authentication failed`,
    });
  }
};

exports.getPostedProducts = async (req, res) => {
  try {
    const sub = req.params.id;
    const user = await User.findOne({ sub: sub });
    if (
      req.headers.access_token &&
      String(user.access_token) === String(req.headers.access_token)
    ) {
      const posts = await Product.find({ sub: sub });
      res.status(201).json({
        status: 'sucess',
        data: {
          posts: posts,
        },
      });
    } else {
      res.status(401).json({
        status: 'fail',
        message: 'Autherisation failed',
      });
    }
  } catch (error) {
    res.status(500).json({
      status: 'fail',
      message: err,
    });
  }
};
