const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const path = require('path');
const env = require('./config/env');
const { globalLimiter } = require('./middleware/rateLimiter');
const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');
const routes = require('./routes');

const app = express();

app.set('trust proxy', 1); // for rate-limit + cookies behind Render/Railway
app.use(
    helmet({
        // The API only returns JSON and static images.
        // CSP belongs on the *frontend host* (Vercel) — see Phase 10.
        contentSecurityPolicy: false,
        crossOriginResourcePolicy: { policy: 'cross-origin' },
        // Explicitly enabled below via `helmet()` defaults: X-Content-Type-Options,
        // X-Frame-Options (DENY), Strict-Transport-Security, X-DNS-Prefetch-Control.
    })
);
app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: [],
    maxAge: 86_400,
  })
);
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use(cookieParser());
app.use(mongoSanitize());
if (env.NODE_ENV !== 'test') app.use(morgan(env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// Local image serving (dev fallback when Cloudinary isn't configured)
app.use('/uploads', express.static(path.resolve(process.cwd(), 'uploads')));

// Global API rate limit
app.use('/api', globalLimiter, routes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;