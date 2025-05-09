import mongoose from 'mongoose';

// User model
const UserSchema = mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  company: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

// Add unique index using schema.index()
UserSchema.index({ email: 1 }, { unique: true });

const User = mongoose.models.User || mongoose.model('User', UserSchema);

// Email event model
const EmailEventSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, required: true }, // 'open', 'click'
  emailId: { type: String, required: true },
  recipient: { type: String, required: true },
  company: { type: String, required: true },
  linkClicked: { type: String }, // Only for 'click' events
  userAgent: { type: String },
  ipAddress: { type: String },
  timestamp: { type: Date, default: Date.now }
});

const EmailEvent = mongoose.models.EmailEvent || mongoose.model('EmailEvent', EmailEventSchema);

export { User, EmailEvent };