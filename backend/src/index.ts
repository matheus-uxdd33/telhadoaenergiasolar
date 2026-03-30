import express, { Express, Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import authRoutes from "./modules/auth/auth.routes";
import dashboardRoutes from "./modules/dashboard/dashboard.routes";
import systemRoutes from "./modules/system/system.routes";
import alertsRoutes from "./modules/alerts/alerts.routes";
import profileRoutes from "./modules/profile/profile.routes";
import { authenticate } from "./common/middlewares/auth.middleware";
import { errorHandler } from "./common/middlewares/error.middleware";

const app: Express = express();
const PORT = process.env.PORT || 4000;

// Middlewares globais
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true,
}));
app.use(express.json());

// Rotas públicas
app.use("/api/auth", authRoutes);

// Rotas protegidas
app.use("/api", authenticate);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/system", systemRoutes);
app.use("/api/alerts", alertsRoutes);
app.use("/api/profile", profileRoutes);

// Health check
app.get("/health", (req: Request, res: Response) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Tratamento de erros
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`✅ Backend rodando em http://localhost:${PORT}/api`);
});
