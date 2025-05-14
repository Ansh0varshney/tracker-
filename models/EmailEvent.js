import mongoose from 'mongoose';

// User model
const UserSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  company: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }, 
  activated: {type:Boolean, required: true},
  class: {type:String, required: true},
  currentflow: {type: String},
});

const User = mongoose.models.User || mongoose.model('User', UserSchema);

// Campaign model
const CampaignSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  description: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const Campaign = mongoose.models.Campaign || mongoose.model('Campaign', CampaignSchema);

// Email event model
const EmailEventSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  campaign: { type: mongoose.Schema.Types.ObjectId, ref: 'Campaign', required: true },
  type: { type: String, required: true }, // 'open', 'click'
  recipient: { type: String, required: true },
  company: { type: String, required: true },
  linkClicked: { type: String }, // Only for 'click' events
  ipAddress: { type: String },
  userAgent: {type:String},
  timestamp: { type: Date, default: Date.now }
});

const EmailEvent = mongoose.models.EmailEvent || mongoose.model('EmailEvent', EmailEventSchema);

export { User, Campaign, EmailEvent };