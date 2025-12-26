import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(2, "Nombre requerido"),
  price: z.number().min(1, "Precio debe ser mayor a 0"),
  stock: z.number().min(0, "Stock debe ser 0 o mayor"),
  category: z.enum(["lacteos","bebidas","panaderia","otros"], {
      errorMap: () => ({ message: "Categoría inválida" })
  })
});
