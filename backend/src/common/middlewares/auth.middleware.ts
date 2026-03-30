import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    tenantId: string;
    email: string;
  };
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1];
  
  if (!token) {
    return res.status(401).json({ error: "Token ausente" });
  }

  try {
    const secret = process.env.JWT_SECRET || "super-secret-demo-key";
    const decoded = jwt.verify(token, secret) as any;
    req.user = {
      userId: decoded.userId,
      tenantId: decoded.tenantId,
      email: decoded.email,
    };
    next();
  } catch (error) {
    res.status(401).json({ error: "Token inválido" });
  }
};
