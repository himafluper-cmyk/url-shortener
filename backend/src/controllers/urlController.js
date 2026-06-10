import { nanoid } from 'nanoid';
import Url from '../models/URL.js';
import { createError } from '../utils/errorHandler.js';
import logger from '../utils/logger.js';

const isValidUrl = (string) => {
  try {
    const url = new globalThis.URL(string);
    return ['http:', 'https:'].includes(url.protocol);
  } catch (_) {
    return false;
  }
};

const detectDevice = (ua = '') => {
  if (/mobile/i.test(ua)) return 'mobile';
  if (/tablet|ipad/i.test(ua)) return 'tablet';
  return 'desktop';
};

// POST /api/urls — Create short URL
export const createShortUrl = async (req, res, next) => {
  try {
    const { originalUrl, customAlias, expiresAt, password, tags, title } = req.body;

    if (!isValidUrl(originalUrl)) {
      return next(createError(400, 'Invalid URL. Must include http:// or https://'));
    }

    // Custom alias check
    if (customAlias) {
      const exists = await Url.findOne({ shortCode: customAlias });
      if (exists) return next(createError(409, 'This custom alias is already taken.'));
      if (!/^[a-zA-Z0-9_-]{3,20}$/.test(customAlias)) {
        return next(createError(400, 'Alias must be 3–20 chars (letters, numbers, _ or -)'));
      }
    }

    const shortCode = customAlias || nanoid(7);

    const urlDoc = await Url.create({
      originalUrl,
      shortCode,
      customAlias: customAlias || null,
      user: req.user?._id || null,
      expiresAt: expiresAt ? new Date(expiresAt) : null,
      password: password || null,
      tags: tags || [],
      title: title || null,
    });

    logger.info(`Short URL created: ${shortCode} → ${originalUrl}`);

    res.status(201).json({
      success: true,
      data: {
        ...urlDoc.toJSON(),
        shortUrl: `${process.env.BASE_URL}/${shortCode}`,
      },
    });
  } catch (err) {
    next(err);
  }
};

// GET /:shortCode — Redirect
export const redirectToOriginal = async (req, res, next) => {
  try {
    const { shortCode } = req.params;
    const urlDoc = await Url.findOne({ shortCode, isActive: true });

    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');

    if (!urlDoc) return next(createError(404, 'Short URL not found.'));
    if (urlDoc.isExpired()) {
      const frontendBase = process.env.FRONTEND_URL || 'http://localhost:5173';
      const expiredUrl = new URL('/expired', frontendBase);
      expiredUrl.searchParams.set('code', shortCode);
      return res.redirect(302, expiredUrl.toString());
    }

    // Record click asynchronously
    const clickData = {
      ip: req.ip,
      userAgent: req.headers['user-agent'],
      referer: req.headers['referer'] || 'Direct',
      device: detectDevice(req.headers['user-agent']),
      clickedAt: new Date(),
    };
    urlDoc.recordClick(clickData).catch((e) => logger.error('Click record failed:', e));

    res.redirect(302, urlDoc.originalUrl);
  } catch (err) {
    next(err);
  }
};

// GET /api/urls — Get all URLs for user
export const getUserUrls = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const search = req.query.search || '';

    const query = { user: req.user._id };
    if (search) {
      query.$or = [
        { originalUrl: { $regex: search, $options: 'i' } },
        { shortCode: { $regex: search, $options: 'i' } },
        { title: { $regex: search, $options: 'i' } },
      ];
    }

    const [urls, total] = await Promise.all([
      Url.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Url.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      data: urls,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/urls/:id — Get single URL with analytics
export const getUrlById = async (req, res, next) => {
  try {
    const urlDoc = await Url.findOne({ _id: req.params.id, user: req.user._id });
    if (!urlDoc) return next(createError(404, 'URL not found.'));

    // Aggregate device stats
    const deviceStats = urlDoc.clickDetails.reduce((acc, click) => {
      acc[click.device] = (acc[click.device] || 0) + 1;
      return acc;
    }, {});

    // Clicks over last 7 days
    const now = new Date();
    const clicksByDay = [];
    for (let i = 6; i >= 0; i--) {
      const day = new Date(now);
      day.setDate(day.getDate() - i);
      const dayStr = day.toISOString().split('T')[0];
      const count = urlDoc.clickDetails.filter(
        (c) => c.clickedAt?.toISOString().split('T')[0] === dayStr
      ).length;
      clicksByDay.push({ date: dayStr, clicks: count });
    }

    res.status(200).json({
      success: true,
      data: urlDoc,
      analytics: {
        totalClicks: urlDoc.clicks,
        deviceStats,
        clicksByDay,
      },
    });
  } catch (err) {
    next(err);
  }
};

// PATCH /api/urls/:id — Update URL
export const updateUrl = async (req, res, next) => {
  try {
    const { title, tags, expiresAt, isActive } = req.body;
    const urlDoc = await Url.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { title, tags, expiresAt, isActive },
      { new: true, runValidators: true }
    );
    if (!urlDoc) return next(createError(404, 'URL not found.'));
    res.status(200).json({ success: true, data: urlDoc });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/urls/:id — Delete URL
export const deleteUrl = async (req, res, next) => {
  try {
    const urlDoc = await Url.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!urlDoc) return next(createError(404, 'URL not found.'));
    res.status(200).json({ success: true, message: 'URL deleted successfully.' });
  } catch (err) {
    next(err);
  }
};

// GET /api/urls/stats — Dashboard stats
export const getDashboardStats = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const [totalUrls, totalClicksAgg, activeUrls] = await Promise.all([
      Url.countDocuments({ user: userId }),
      Url.aggregate([{ $match: { user: userId } }, { $group: { _id: null, total: { $sum: '$clicks' } } }]),
      Url.countDocuments({ user: userId, isActive: true }),
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalUrls,
        totalClicks: totalClicksAgg[0]?.total || 0,
        activeUrls,
      },
    });
  } catch (err) {
    next(err);
  }
};
