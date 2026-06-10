import mongoose from 'mongoose';

const clickSchema = new mongoose.Schema(
  {
    ip: String,
    userAgent: String,
    referer: String,
    country: String,
    city: String,
    device: { type: String, enum: ['mobile', 'tablet', 'desktop'], default: 'desktop' },
    browser: String,
    os: String,
    clickedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const urlSchema = new mongoose.Schema(
  {
    originalUrl: {
      type: String,
      required: [true, 'Original URL is required'],
      trim: true,
    },
    shortCode: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 20,
      index: true,
    },
    customAlias: {
      type: String,
      default: null,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    clicks: {
      type: Number,
      default: 0,
    },
    clickDetails: [clickSchema],
    isActive: {
      type: Boolean,
      default: true,
    },
    expiresAt: {
      type: Date,
      default: null,
    },
    password: {
      type: String,
      default: null,
      select: false,
    },
    tags: [{ type: String, trim: true }],
    title: { type: String, default: null },
    description: { type: String, default: null },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual: short URL
urlSchema.virtual('shortUrl').get(function () {
  return `${process.env.BASE_URL}/${this.shortCode}`;
});

// Auto-expire index
urlSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0, sparse: true });

// Check if URL is expired
urlSchema.methods.isExpired = function () {
  if (!this.expiresAt) return false;
  return new Date() > this.expiresAt;
};

// Increment click count
urlSchema.methods.recordClick = async function (clickData = {}) {
  this.clicks += 1;
  if (this.clickDetails.length < 1000) {
    this.clickDetails.push(clickData);
  }
  return this.save();
};

const URL = mongoose.model('URL', urlSchema);
export default URL;
