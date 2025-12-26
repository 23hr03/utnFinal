import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { UserModel } from "../model/user.model";

export const register = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  if (!process.env.JWT_SECRET) {
    return res.status(500).json({ message: "JWT_SECRET no configurado" });
  }

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Todos los campos son obligatorios" });
  }

  const exists = await UserModel.findOne({ email });
  if (exists) {
    return res.status(409).json({ message: "El email ya está registrado" });
  }

  const hashed = await bcrypt.hash(password, 10);

  await UserModel.create({
    name,
    email,
    password: hashed,
    role: "user",
  });

  res.status(201).json({ message: "Usuario creado correctamente" });
};

export const login = async (req: Request, res: Response) => {
  try {
    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ message: "JWT_SECRET no configurado" });
    }

    const { email, password } = req.body;

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        name: user.name,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Error en login" });
  }
};

export const me = async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: "No autorizado" });
  }

  res.json({
    id: req.user.id,
    email: req.user.email,
    role: req.user.role,
  });
};
