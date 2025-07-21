const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Product = require('../models/Product');

// Get all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find({ status: 'active' }).sort({ createdAt: -1 });
    res.status(200).json({ products });
  } catch (err) {
    console.error('Error getting products:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Search products
router.get('/search', async (req, res) => {
  try {
    const { q, category } = req.query;
    const query = {
      status: 'active',
      $or: [
        { title: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } }
      ]
    };

    if (category) {
      query.category = category;
    }

    const products = await Product.find(query).sort({ createdAt: -1 });
    res.status(200).json({ products });
  } catch (err) {
    console.error('Error searching products:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get a single product
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json({ product });
  } catch (err) {
    console.error('Error getting product:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new product
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, price, category, condition, images, allowBidding, allowBarter } = req.body;

    const newProduct = new Product({
      title,
      description,
      price,
      category,
      condition,
      images: images || ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'],
      ownerId: req.user.id,
      ownerName: req.user.username,
      allowBidding: allowBidding !== undefined ? allowBidding : true,
      allowBarter: allowBarter !== undefined ? allowBarter : true,
      endsAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
    });

    const savedProduct = await newProduct.save();
    res.status(201).json({ product: savedProduct });
  } catch (err) {
    console.error('Error creating product:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update a product
router.put('/:id', auth, async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if user owns the product
    if (product.ownerId.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized to update this product' });
    }

    // Update fields
    const { title, description, price, category, condition, images, allowBidding, allowBarter, status } = req.body;
    
    if (title) product.title = title;
    if (description) product.description = description;
    if (price !== undefined) product.price = price;
    if (category) product.category = category;
    if (condition) product.condition = condition;
    if (images && images.length > 0) product.images = images;
    if (allowBidding !== undefined) product.allowBidding = allowBidding;
    if (allowBarter !== undefined) product.allowBarter = allowBarter;
    if (status) product.status = status;

    await product.save();
    res.status(200).json({ product });
  } catch (err) {
    console.error('Error updating product:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a product
router.delete('/:id', auth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if user owns the product
    if (product.ownerId.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized to delete this product' });
    }

    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (err) {
    console.error('Error deleting product:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Place a bid on a product
router.post('/:id/bid', auth, async (req, res) => {
  try {
    const { amount } = req.body;
    
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Check if product allows bidding
    if (!product.allowBidding) {
      return res.status(400).json({ message: 'This product does not allow bidding' });
    }
    
    // Check if product is active
    if (product.status !== 'active') {
      return res.status(400).json({ message: 'This product is not active for bidding' });
    }
    
    // Check if user is not the owner
    if (product.ownerId.toString() === req.user.id) {
      return res.status(400).json({ message: 'You cannot bid on your own product' });
    }
    
    // Check if bid amount is higher than current highest bid
    const highestBid = product.bids.length > 0 
      ? Math.max(...product.bids.map(bid => bid.amount))
      : 0;
      
    if (amount <= highestBid) {
      return res.status(400).json({ message: `Bid amount must be higher than current highest bid: ₹${highestBid}` });
    }
    
    // Add new bid
    product.bids.push({
      amount,
      bidderId: req.user.id,
      bidderName: req.user.username,
      createdAt: Date.now()
    });
    
    await product.save();
    res.status(201).json({ message: 'Bid placed successfully', product });
  } catch (err) {
    console.error('Error placing bid:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Make a barter offer on a product
router.post('/:id/offer', auth, async (req, res) => {
  try {
    const { itemOfferedId, message = '' } = req.body;
    
    // Check if product exists
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Check if product allows bartering
    if (!product.allowBarter) {
      return res.status(400).json({ message: 'This product does not allow bartering' });
    }
    
    // Check if product is active
    if (product.status !== 'active') {
      return res.status(400).json({ message: 'This product is not active for bartering' });
    }
    
    // Check if user is not the owner
    if (product.ownerId.toString() === req.user.id) {
      return res.status(400).json({ message: 'You cannot make offers on your own product' });
    }
    
    // Check if offered item exists and belongs to user
    const offeredItem = await Product.findById(itemOfferedId);
    if (!offeredItem) {
      return res.status(404).json({ message: 'Offered item not found' });
    }
    
    if (offeredItem.ownerId.toString() !== req.user.id) {
      return res.status(401).json({ message: 'You can only offer items you own' });
    }
    
    // Add barter offer
    product.offers.push({
      fromUserId: req.user.id,
      fromUserName: req.user.username,
      itemOfferedId,
      itemOfferedTitle: offeredItem.title,
      itemOfferedImage: offeredItem.images[0],
      message,
      status: 'pending',
      createdAt: Date.now()
    });
    
    await product.save();
    res.status(201).json({ message: 'Barter offer made successfully', product });
  } catch (err) {
    console.error('Error making barter offer:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Respond to a barter offer
router.put('/:id/offer/:offerId', auth, async (req, res) => {
  try {
    const { status } = req.body;
    
    // Check if status is valid
    if (!['accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    
    // Check if product exists
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Check if user owns the product
    if (product.ownerId.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized to respond to offers on this product' });
    }
    
    // Find the offer
    const offerIndex = product.offers.findIndex(
      offer => offer._id.toString() === req.params.offerId
    );
    
    if (offerIndex === -1) {
      return res.status(404).json({ message: 'Offer not found' });
    }
    
    // Update offer status
    product.offers[offerIndex].status = status;
    
    // If offer is accepted, update product status to sold
    if (status === 'accepted') {
      product.status = 'sold';
    }
    
    await product.save();
    res.status(200).json({ message: `Offer ${status}`, product });
  } catch (err) {
    console.error('Error responding to offer:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's products
router.get('/user/:userId', async (req, res) => {
  try {
    const products = await Product.find({ ownerId: req.params.userId });
    res.status(200).json({ products });
  } catch (err) {
    console.error('Error getting user products:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
