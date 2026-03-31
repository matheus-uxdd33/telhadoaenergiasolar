import express, { Express, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import authRoutes from "./modules/auth/auth.routes";
import dashboardRoutes from "./modules/dashboard/dashboard.routes";
import systemRoutes from "./modules/system/system.routes";
import alertsRoutes from "./modules/alerts/alerts.routes";
import profileRoutes from "./modules/profile/profile.routes";
import billingRoutes, { billingWebhookHandler } from "./modules/billing/billing.routes";
import { authenticate } from "./common/middlewares/auth.middleware";
import { errorHandler } from "./common/middlewares/error.middleware";

const app: Express = express();

app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true,
}));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.post("/api/billing/webhook/pagbank", billingWebhookHandler);
app.use("/api", authenticate);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/system", systemRoutes);
app.use("/api/alerts", alertsRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/billing", billingRoutes);

app.get("/health", (_req: Request, res: Response) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use(errorHandler);

export default app;
