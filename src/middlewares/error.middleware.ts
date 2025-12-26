import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error("🔥 ERROR:", err);

  // 🟡 Validaciones (Zod)
  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      message: "Datos inválidos, Correo o contraseña incorrectas",
      errors: err.errors.map(e => ({
        field: e.path.join("."),
        message: e.message
      }))
    });
  }

  // 🔴 Errores con status personalizado
  if (err.status) {
    return res.status(err.status).json({
      success: false,
      message: err.message,
      errors: err.errors || []
    });
  }

  // 🔥 Error interno
  return res.status(500).json({
    success: false,
    message: "Error interno del servidor",
    errors: []
  });
}
