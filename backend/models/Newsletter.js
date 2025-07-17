const mongoose = require('mongoose');

const NewsletterSubscriberSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  subscribedAt: {
    type: Date,
    default: Date.now
  }
});

const NewsletterSubscriber = mongoose.model('NewsletterSubscriber', NewsletterSubscriberSchema);

module.exports = NewsletterSubscriber;
