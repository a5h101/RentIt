const Product = require('../models/productsModel');
const Users = require('../models/usersModel');

exports.saveItem = async (req, res) => {
  try {
    const id = req.params.id;
    const update = { savedProducts: id };
    const filter = { sub: req.body.user };
    const userCheck = await Users.findOne(filter);
    if (
      req.headers.access_token &&
      String(userCheck.access_token) === String(req.headers.access_token) &&
      userCheck.savedProducts.length < 5
    ) {
      const user = await Users.findOneAndUpdate(
        filter,
        { $addToSet: update },
        (err) => {
          if (err) console.log(err);
        }
      );
      res.status(201).json({
        status: 'sucess',
        data: {
          savedItems: `Done ${id}`,
          user: user,
        },
      });
    } else {
      res.status(403).json({
        status: 'fail',
        message: 'Authentication failed',
      });
    }
  } catch (err) {
    console.log(err);
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};
exports.upateItem = async (req, res) => {
  try {
    const id = req.params.id;
    const update = req.params.update;
    const product = await Product.findOne({ _id: id });
    if (product.sub === req.headers.sub) {
      product.available = update;
      await product.save();
      return res.status(200).json({
        status: 'sucess',
        data: {
          available: product.available,
        },
      });
    } else {
      res.status(403).json({
        status: 'fail',
        message: `Authentication failed`,
      });
    }
  } catch (err) {
    console.log(err);
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};
exports.updateLikes = async (req, res) => {
  try {
    const id = req.params.id;
    const like = req.params.like;
    const userCheck = await Users.findOne({ sub: req.body.user });
    if (
      req.headers.access_token &&
      String(userCheck.access_token) === String(req.headers.access_token)
    ) {
      const product = await Product.findOne({ _id: id });

      const update = { likedProducts: id };
      if (like === 'true') {
        const user = await Users.findOneAndUpdate(
          { sub: req.body.user },
          { $addToSet: update },
          (err) => {
            if (err) console.log(err);
          }
        );
        product.likes++;
        await product.save();
        return res.status(200).json({
          status: 'sucess',
          data: {
            likes: product.likes,
            user: user,
          },
        });
      } else if (like === 'false') {
        await Users.findOneAndUpdate(
          { sub: req.body.user },
          { $pull: { likedProducts: id } },
          { new: true }
        );
        product.likes--;
        await product.save();
        return res.status(200).json({
          status: 'sucess',
          data: {
            likes: product.likes,
          },
        });
      } else {
        res.status(400).json({
          status: 'fail',
          message: `invalid`,
        });
      }
    } else {
      res.status(403).json({
        status: 'fail',
        message: `Authentication failed`,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(404).json({
      status: 'fail',
      message: error,
    });
  }
};
