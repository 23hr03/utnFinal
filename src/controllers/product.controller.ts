import { Request, Response } from "express";
import Product from "../model/product.model";

/* =========================
   LISTAR PRODUCTOS + QUERY PARAMS
========================= */
export const getProducts = async (req: Request, res: Response) => {
  try {
    const { category, name, minPrice, maxPrice } = req.query;

    const query: any = {};

    // 🔎 Filtrar por categoría
    if (category) {
      query.category = category;
    }

    // 🔎 Filtrar por nombre (búsqueda parcial, case insensitive)
    if (name) {
      query.name = { $regex: name, $options: "i" };
    }

    // 🔎 Filtrar por rango de precios
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    const products = await Product.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener productos",
    });
  }
};

/* =========================
   CREAR PRODUCTO
========================= */
export const createProduct = async (req: Request, res: Response) => {
  try {
    const { name, price, stock, category, image } = req.body;

    /* VALIDACIONES */
    if (!name || name.trim().length < 3) {
      return res.status(400).json({
        message: "El nombre debe tener al menos 3 caracteres",
      });
    }

    if (!category) {
      return res.status(400).json({
        message: "La categoría es obligatoria",
      });
    }

    if (price === undefined || Number(price) <= 0) {
      return res.status(400).json({
        message: "El precio debe ser mayor a 0",
      });
    }

    if (stock !== undefined && Number(stock) < 0) {
      return res.status(400).json({
        message: "El stock no puede ser negativo",
      });
    }

    const product = new Product({
      name: name.trim(),
      price,
      stock: stock ?? 0,
      category,
      image,
    });

    await product.save();

    res.status(201).json({
      message: "Producto creado correctamente",
      product,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al crear producto",
    });
  }
};

/* =========================
   EDITAR PRODUCTO
========================= */
export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, price, stock, category, image } = req.body;

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        message: "Producto no encontrado",
      });
    }

    /* VALIDACIONES */
    if (name && name.trim().length < 3) {
      return res.status(400).json({
        message: "El nombre debe tener al menos 3 caracteres",
      });
    }

    if (price !== undefined && Number(price) <= 0) {
      return res.status(400).json({
        message: "El precio debe ser mayor a 0",
      });
    }

    if (stock !== undefined && Number(stock) < 0) {
      return res.status(400).json({
        message: "El stock no puede ser negativo",
      });
    }

    product.name = name ?? product.name;
    product.price = price ?? product.price;
    product.stock = stock ?? product.stock;
    product.category = category ?? product.category;
    product.image = image ?? product.image;

    await product.save();

    res.status(200).json({
      message: "Producto actualizado correctamente",
      product,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al actualizar producto",
    });
  }
};

/* =========================
   ELIMINAR PRODUCTO
========================= */
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({
        message: "Producto no encontrado",
      });
    }

    res.status(200).json({
      message: "Producto eliminado correctamente",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al eliminar producto",
    });
  }
};
