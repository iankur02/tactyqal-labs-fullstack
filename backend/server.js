require('dotenv').config();

const app = require('./src/app');
const connectDB = require('./src/config/db');
const env = require('./src/config/env');

(async () => {
  try {
    await connectDB();
    const server = app.listen(env.PORT, () => {
      console.log(`🚀 Tactyqal API listening on http://localhost:${env.PORT} [${env.NODE_ENV}]`);
    });

    // graceful shutdown
    const shutdown = (signal) => {
      console.log(`\n${signal} received — closing server...`);
      server.close(() => process.exit(0));
    };
    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGTERM', () => shutdown('SIGTERM'));
  } catch (err) {
    console.error('❌ Fatal startup error:', err);
    process.exit(1);
  }
})();