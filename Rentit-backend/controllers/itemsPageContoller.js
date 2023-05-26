const Product = require('../models/productsModel');
const User = require('../models/usersModel');
const APIFeatures = require('./../utils/apiFeatures');
const cloudinary = require('cloudinary').v2;
cloudinary.config({
  cloud_name: `${process.env.CLOUD_NAME}`,
  api_key: `${process.env.API_KEY}`,
  api_secret: `${process.env.API_SECRET}`,
});

exports.getItems = async (req, res) => {
  try {
    //This class will hanlde queries attached on request
    const features = new APIFeatures(Product.find(), req.query)
      .filter()
      .search()
      .sort();

    const items = await features.query; //wait till fearure return the final output after chaining

    res.status(200).json({
      status: 'success',
      results: items.length,
      data: {
        items: items,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.getItemDetails = async (req, res) => {
  try {
    const item = await Product.findById(req.params.id);
    res.status(200).json({
      status: 'sucess',
      data: {
        item: item,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};
exports.deleteItem = async (req, res) => {
  try {
    const { id, type } = req.params;
    const user = await User.findOne({ sub: req.headers.sub });
    if (
      req.headers.access_token &&
      String(user.access_token) === String(req.headers.access_token)
    ) {
      //Check the post type
      if (type === 'posts') {
        const product = await Product.findById(req.params.id);
        if (product.sub === user.sub) {
          // Delete the product's image from cloudinary
          cloudinary.uploader.destroy(product.image.public_id);
          // Delete the post's document and related data
          const deleteResult = await Product.deleteOne({ _id: req.params.id });
          if (deleteResult.deletedCount > 0) {
            // Delete the product from user's savedProducts
            await User.updateMany(
              { savedProducts: req.params.id },
              { $pull: { savedProducts: req.params.id } }
            );
            // Delete the product from user's likedProducts
            await User.updateMany(
              { likedProducts: req.params.id },
              { $pull: { likedProducts: req.params.id } }
            );
            res.status(204).json({
              status: 'success',
              data: null,
            });
          } else {
            res.status(404).json({
              status: 'fail',
              message: 'Product not found.',
            });
          }
        } else {
          res.status(403).json({
            status: 'fail',
            message: 'Unauthorized to delete this product.',
          });
        }
      } else if (type === 'saves') {
        await User.findOneAndUpdate(
          { sub: user.sub },
          { $pull: { savedProducts: id } },
          { new: true }
        );
        res.status(204).json({
          status: 'sucess',
          data: null,
        });
      }
    } else {
      res.status(401).json({
        status: 'fail',
        message: 'Autherisation failed',
      });
    }
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};
