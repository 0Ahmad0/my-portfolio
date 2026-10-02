import { Router, type IRouter } from "express";
import { z } from "zod";

const router: IRouter = Router();

// ponytail: the response shape is three lines; the old @workspace/api-zod
// package existed only to hold this one schema, generated from an OpenAPI
// spec nothing else consumed.
const HealthCheckResponse = z.object({ status: z.string() });

router.get("/healthz", (_req, res) => {
  const data = HealthCheckResponse.parse({ status: "ok" });
  res.json(data);
});

export default router;