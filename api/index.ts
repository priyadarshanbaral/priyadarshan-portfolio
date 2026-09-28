// Vercel serverless entrypoint.
//
// Vercel's Node runtime imports this file and calls the default export as a
// request handler. We re-export the Express app built in ../server.ts so that
// every /api/* route (AI assistant, contact form, avatar upload, db status)
// runs on Vercel instead of returning 404.
//
// Locally this file is never used — `npm run dev` boots server.ts directly,
// which calls app.listen() on port 3000.

import app from "../server";

export default app;
