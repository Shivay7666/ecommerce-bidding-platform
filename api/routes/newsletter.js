const express = require('express');
const router = express.Router();
const NewsletterSubscriber = require('../models/Newsletter');

// Subscribe to newsletter
router.post('/subscribe', async (req, res) => {
  try {
    const { email } = req.body;

    // Check if email format is valid
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    // Check if email already exists
    const existingEmail = await NewsletterSubscriber.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: 'Email already subscribed' });
    }

    // Create new subscription
    const newSubscription = new NewsletterSubscriber({
      email,
      subscribedAt: Date.now()
    });

    await newSubscription.save();
    res.status(201).json({ message: 'Successfully subscribed to newsletter' });
  } catch (err) {
    console.error('Error subscribing to newsletter:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Unsubscribe from newsletter
router.post('/unsubscribe', async (req, res) => {
  try {
    const { email } = req.body;

    // Check if subscription exists
    const subscription = await NewsletterSubscriber.findOne({ email });
    if (!subscription) {
      return res.status(404).json({ message: 'Email not found in subscription list' });
    }

    // Remove subscription
    await NewsletterSubscriber.findOneAndDelete({ email });
    res.status(200).json({ message: 'Successfully unsubscribed from newsletter' });
  } catch (err) {
    console.error('Error unsubscribing from newsletter:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
