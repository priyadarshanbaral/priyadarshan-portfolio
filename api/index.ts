// Vercel serverless entrypoint.
//
// Vercel's Node runtime imports this file and calls the default export as a
// request handler. We re-export the Express app built in ../server so that
// every /api/* route (AI assistant, contact form, avatar upload, db status)
// runs on Vercel instead of returning 404.
//
// NOTE: the ".js" extension is required. Vercel compiles this file to
// api/index.js and runs it as native ESM, whose resolver does not do
// extensionless lookups — omitting it causes ERR_MODULE_NOT_FOUND at runtime.
//
// Locally this file is never used — `npm run dev` boots server.ts directly,
// which calls app.listen() on port 3000.

import app from "../server.js";

export default app;
