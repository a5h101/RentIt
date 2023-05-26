const mongoose = require('mongoose');
const productSchema = new mongoose.Schema({
  image: {
    image: {
      type: String,
      required: true,
    },
    public_id: {
      type: String,
      required: true,
    },
  },
  owner: {
    type: String,
    required: [true, 'name is required'],
    unique: false,
    trim: true,
  },
  product: {
    type: String,
    required: [true, 'name is required'],
    trim: true,
    validate: {
      validator: function (value) {
        const wordCount = value.trim().length;
        return wordCount >= 3 && wordCount <= 25;
      },
      message: 'Name must be 25 words or fewer',
    },
  },
  price: {
    type: Number,
    required: [true, 'Price is compulsory'],
    trim: true,
  },
  unit: {
    type: String,
    required: [true, 'Unit feild is required'],
  },
  contact: {
    type: Number,
    required: [true, 'Contact feild is required'],
  },
  lpuid: {
    type: Number,
    required: [true, 'Lpu ID feild is required'],
  },
  description: {
    type: String,
    required: [true, 'Description feild is required'],
    trim: true,
    validate: {
      validator: function (value) {
        const wordCount = value.trim().length;
        return wordCount >= 10 && wordCount <= 230;
      },
      message: 'Description must be 230 words or fewer',
    },
  },
  sub: {
    type: String,
    required: true,
  },
  available: {
    type: Boolean,
    default: true,
  },
  likes: {
    type: Number,
    default: 0,
  },
  type: {
    type: String,
    required: true,
    enum: {
      values: [
        'electronics',
        'clothes',
        'sports',
        'hardware',
        'accessories',
        'others',
      ],
      message: 'Not accepted type',
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  // email: { type: mongoose.Schema.Types.String, ref: 'Users' },
});

const Product = mongoose.model('product', productSchema);

module.exports = Product;
