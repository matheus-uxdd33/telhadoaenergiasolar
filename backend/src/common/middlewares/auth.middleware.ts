import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { supabaseAdmin, hasSupabaseEnv } from "../../database/supabase";
import { FeatureKey, getPlanByCode } from "../../modules/billing/plans";

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    tenantId: string;
    email: string;
    name?: string;
    planCode?: string;
    planStatus?: string;
    features?: string[];
  };
}

export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Token ausente" });
  }

  try {
    if (hasSupabaseEnv && supabaseAdmin) {
      const { data, error } = await supabaseAdmin.auth.getUser(token).catch(err => ({ data: { user: null }, error: err }));

      if (error || !data.user) {
        console.warn("Supabase Auth Error:", error?.message);
        // Fallback para desenvolvimento/visualização se o token parecer um JWT mas o Supabase rejeitar a chave de API
        if (error?.message?.includes("API key")) {
          try {
            const decoded = jwt.decode(token) as any;
            if (decoded && decoded.email) {
              req.user = {
                userId: decoded.sub || decoded.userId || "demo-user",
                tenantId: decoded.tenant_id || "tenant-demo",
                email: decoded.email,
                name: decoded.name || "Usuário",
                planCode: "residencial_full",
                planStatus: "trial",
                features: ["current_generation", "emergency_alerts"],
              };
              return next();
            }
          } catch (e) { }
        }
        return res.status(401).json({ error: error?.message || "Token Supabase inválido" });
      }

      const metadata = data.user.user_metadata || {};
      const plan = getPlanByCode(metadata.plan_code as string | undefined);

      req.user = {
        userId: data.user.id,
        tenantId: (metadata.tenant_id as string) || "tenant-demo",
        email: data.user.email || "",
        name: (metadata.name as string) || "Cliente",
        planCode: plan.code,
        planStatus: (metadata.plan_status as string) || "trial",
        features: plan.features,
      };

      return next();
    }

    const secret = process.env.JWT_SECRET || "super-secret-demo-key";
    const decoded = jwt.verify(token, secret) as any;
    const plan = getPlanByCode(decoded.planCode as string | undefined);

    req.user = {
      userId: decoded.userId,
      tenantId: decoded.tenantId,
      email: decoded.email,
      name: decoded.name,
      planCode: plan.code,
      planStatus: decoded.planStatus || "trial",
      features: plan.features,
    };
    return next();
  } catch (_error) {
    return res.status(401).json({ error: "Token inválido" });
  }
};

export const requireFeature = (feature: FeatureKey) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (req.user?.features?.includes(feature)) {
      return next();
    }

    return res.status(403).json({
      error: `O seu plano atual não possui acesso ao recurso: ${feature}.`,
      requiredFeature: feature,
      currentPlan: req.user?.planCode,
    });
  };
};
