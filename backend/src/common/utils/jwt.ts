import jwt from "jsonwebtoken";

interface TokenPayload {
  userId: string;
  tenantId: string;
  email: string;
}

export const generateToken = (payload: TokenPayload, expiresIn = "24h"): string => {
  const secret = process.env.JWT_SECRET || "super-secret-demo-key";
  return jwt.sign(payload, secret, { expiresIn });
};

export const verifyToken = (token: string): TokenPayload => {
  const secret = process.env.JWT_SECRET || "super-secret-demo-key";
  return jwt.verify(token, secret) as TokenPayload;
};
