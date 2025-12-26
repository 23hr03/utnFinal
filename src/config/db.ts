import mongoose from "mongoose";

const connectDB = async () => {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    console.error("❌ Falta definir MONGO_URI en .env");
    process.exit(1);
  }

  try {
    await mongoose.connect(uri);
    console.log("🔥 MongoDB conectado");
  } catch (e) {
    console.error("❌ Error al conectar Mongo");
    process.exit(1);
  }
};

export default connectDB;
