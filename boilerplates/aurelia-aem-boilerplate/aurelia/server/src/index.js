import 'dotenv/config';
import express from 'express';
import cors from 'cors';

import contactRouter from './routes/contact.js';
import contentRouter from './routes/content.js';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({ origin: process.env.CORS_ORIGIN?.split(',') ?? '*' }));
app.use(express.json({ limit: '1mb' }));

// Healthcheck
app.get('/api/health', (_req, res) => res.json({ status: 'ok', service: 'aurelia-api' }));

// Delivery of "Content Fragments" (gallery, articles). In AEM this is replaced by
// the Content Fragments GraphQL endpoint (/content/_cq_graphql/...).
app.use('/api/content', contentRouter);

// AEM Forms -> Supabase (contact persistence) + Resend (transactional email).
app.use('/api/contact', contactRouter);

// 404 as JSON
app.use((req, res) => res.status(404).json({ error: 'not_found', path: req.path }));

// Centralized error handler
app.use((err, _req, res, _next) => {
  console.error('[api] error:', err);
  res.status(err.status || 500).json({ error: 'internal_error', message: err.message });
});

app.listen(PORT, () => {
  console.log(`\n  Aurelia API listening on http://localhost:${PORT}`);
  console.log(`  Health:   http://localhost:${PORT}/api/health`);
  console.log(`  Content:  http://localhost:${PORT}/api/content/gallery?locale=es\n`);
});
