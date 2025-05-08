import mongoose from 'mongoose';

// Check if the model already exists to prevent OverwriteModelError
const EmailEvent = mongoose.models.EmailEvent || mongoose.model('Email          Event', new mongoose.Schema({
  type: { type: String, required: true }, // 'open', 'click'
  emailId: { type: String, required: true },
  recipient: { type: String, required: true },
  company: { type: String, required: true },
  linkClicked: { type: String }, // Only for 'click' events
  userAgent: { type: String },
  ipAddress: { type: String },
  timestamp: { type: Date, default: Date.now }
}));

export default EmailEvent;