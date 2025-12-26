import { Request, Response, NextFunction } from "express";

export const requireRole = (role: "admin" | "user") => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: "No autenticado" });
    }

    if (req.user.role !== role) {
      return res.status(403).json({ message: "Acceso denegado" });
    }

    next();
  };
};
