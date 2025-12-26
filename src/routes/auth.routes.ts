import { Router } from "express";
import { register, login } from "../controllers/auth.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { UserModel } from "../model/user.model";

const router = Router();

/* ==========================
   AUTH BÁSICO
========================== */

router.post("/register", register);
router.post("/login", login);

/* ==========================
   USUARIO LOGUEADO
========================== */

router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await UserModel.findById(req.user!.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.json(user);
  } catch {
    res.status(500).json({ message: "Error al obtener usuario" });
  }
});

/* ==========================
   EDITAR NOMBRE
========================== */

router.put("/me/name", authMiddleware, async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || name.trim().length < 2) {
      return res.status(400).json({
        message: "El nombre debe tener al menos 2 caracteres",
      });
    }

    const user = await UserModel.findByIdAndUpdate(
      req.user!.id,
      { name },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.json({
      message: "Nombre actualizado correctamente",
      user,
    });
  } catch {
    res.status(500).json({ message: "Error al actualizar nombre" });
  }
});

export default router;
