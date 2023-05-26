const Product = require('../models/productsModel');
const User = require('../models/usersModel');
const cloudinary = require('cloudinary').v2;
cloudinary.config({
  cloud_name: `${process.env.CLOUD_NAME}`,
  api_key: `${process.env.API_KEY}`,
  api_secret: `${process.env.API_SECRET}`,
});

exports.postItem = async (req, res) => {
  try {
    const user = await User.findOne({ sub: req.body.sub });
    if (
      req.headers.access_token &&
      String(user.access_token) === String(req.headers.access_token)
    ) {
      const response = await cloudinary.uploader.upload(req.body.image, {
        folder: 'RentIt',
      });
      const image = { image: response.url, public_id: response.public_id };
      req.body.image = image;
      const newProduct = await Product.create(req.body);
      res.status(201).json({
        status: 'sucess',
        data: {
          products: newProduct,
        },
      });
    } else {
      res.status(401).json({
        status: 'fail',
        message: 'Autherisation failed',
      });
    }
  } catch (err) {
    res.status(500).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.updateItem = async (req, res) => {
  try {
    const user = await User.findOne({ sub: req.headers.sub });
    if (
      req.headers.access_token &&
      String(user.access_token) === String(req.headers.access_token)
    ) {
      const item = await Product.findById(req.params.id);
      //check if the user is owner or not
      if (item.sub === user.sub) {
        let update = { ...req.body };
        //if update request has a new image then delete old from cloudinary
        if (update.image) {
          cloudinary.uploader.destroy(item.image.public_id);
          const response = await cloudinary.uploader.upload(update.image, {
            folder: 'RentIt',
          });
          const image = { image: response.url, public_id: response.public_id };
          update.image = image;
        }
        //Allow only the updates which user can chnage
        const allowedFields = [
          'owner',
          'product',
          'price',
          'unit',
          'contact',
          'lpuid',
          'description',
          'image',
          'type',
        ];

        Object.keys(update).forEach((key) => {
          if (!allowedFields.includes(key)) {
            delete update[key];
          }
        });
        //Push all the updates
        const updatedItem = await Product.findByIdAndUpdate(
          req.params.id,
          update,
          {
            new: true,
            runValidators: true,
          }
        );
        res.status(200).json({
          status: 'sucess',
          data: {
            item: updatedItem,
          },
        });
      } else {
        res.status(403).json({
          status: 'fail',
          message: 'Not allowed',
        });
      }
    } else {
      res.status(401).json({
        status: 'fail',
        message: 'Autherisation failed',
      });
    }
  } catch (err) {
    res.status(500).json({
      status: 'fail',
      message: err,
    });
  }
};
