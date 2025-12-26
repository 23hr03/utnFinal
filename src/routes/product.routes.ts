import { Router } from "express";
import { isAdmin } from "../middlewares/isAdmin";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/product.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { requireRole } from "../middlewares/role.middleware";

const router = Router();

/* ======================
   PRODUCTOS
====================== */

// 📄 Listar productos (usuarios y admin)
router.get("/", authMiddleware, getProducts);

// ➕ Crear producto (solo admin)
router.post(
  "/",
  authMiddleware,
  requireRole("admin"),
  createProduct
);

// ✏️ Editar producto (solo admin)
router.put(
  "/:id",
  authMiddleware,
  requireRole("admin"),
  updateProduct
);

// 🗑 Eliminar producto (solo admin)
router.delete(
  "/:id",
  authMiddleware,
  requireRole("admin"),
  deleteProduct
);

export default router;
