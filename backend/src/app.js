import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';

import authRoutes from './routes/auth.js';
import urlRoutes from './routes/urls.js';
import { redirectToOriginal } from './controllers/urlController.js';
import { globalLimiter, createUrlLimiter, authLimiter } from './middleware/rateLimiter.js';
import { globalErrorHandler } from './utils/errorHandler.js';
import { optionalAuth } from './middleware/auth.js';
import logger from './utils/logger.js';

const app = express();

// ─── Security ──────────────────────────────────────────────
app.use(helmet());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  })
);
app.use(globalLimiter);

// ─── Body Parsing & Compression ────────────────────────────
app.use(compression());
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));

// ─── Logging ───────────────────────────────────────────────
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('combined', { stream: { write: (msg) => logger.info(msg.trim()) } }));
}

// ─── Health Check ──────────────────────────────────────────
app.get('/health', (req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

// ─── API Routes ────────────────────────────────────────────
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/urls', createUrlLimiter, urlRoutes);

// ─── Short URL Redirect ────────────────────────────────────
app.get('/:shortCode', optionalAuth, redirectToOriginal);

// ─── 404 ───────────────────────────────────────────────────
app.use((req, res) => res.status(404).json({ success: false, message: 'Route not found.' }));

// ─── Global Error Handler ──────────────────────────────────
app.use(globalErrorHandler);

export default app;
