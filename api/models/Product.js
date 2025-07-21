const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  condition: {
    type: String,
    required: true,
    enum: ['New', 'Like New', 'Very Good', 'Good', 'Fair', 'Poor']
  },
  images: {
    type: [String],
    required: true,
    validate: [(val) => val.length > 0, 'Product must have at least one image']
  },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  ownerName: {
    type: String,
    required: true
  },
  bids: [{
    amount: Number,
    bidderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    bidderName: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  offers: [{
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    fromUserName: String,
    itemOfferedId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    },
    itemOfferedTitle: String,
    itemOfferedImage: String,
    message: String,
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected'],
      default: 'pending'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  allowBidding: {
    type: Boolean,
    default: true
  },
  allowBarter: {
    type: Boolean,
    default: true
  },
  status: {
    type: String,
    enum: ['active', 'sold', 'closed'],
    default: 'active'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  endsAt: {
    type: Date
  }
});

const Product = mongoose.model('Product', ProductSchema);

module.exports = Product;
module.exports = Product;
