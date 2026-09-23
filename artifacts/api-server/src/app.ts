import express, { type Express } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import router from "./routes";
import { logger } from "./lib/logger";

const app: Express = express();

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);

// Restrict CORS to explicit origins. Default to the dev servers only; in
// production set CORS_ALLOWED_ORIGINS (comma-separated) to the portfolio URL.
// Failing closed: with no configured origin in production, cross-origin
// requests are rejected instead of allowed for everyone.
const corsOrigins = (
  process.env["CORS_ALLOWED_ORIGINS"] ??
  (process.env.NODE_ENV === "production"
    ? ""
    : "http://localhost:5173,http://127.0.0.1:5173")
)
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(cors({ origin: corsOrigins, credentials: true }));

// Single proxy hop is the common PaaS setup; req.ip is used for rate limiting.
// The authoritative rate limit lives in the contact_messages RLS policy.
app.set("trust proxy", 1);

app.use(express.json({ limit: "32kb" }));
app.use(express.urlencoded({ extended: true, limit: "32kb" }));

app.use("/api", router);

export default app;
