import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

// Agar .env faylda DB_URL bo‘lmasa, bu zanjirdan foydalanadi
const dbUrl =
  process.env.DB_URL ||
  `postgres://${process.env.DB_USER || "postgres"}:${
    process.env.DB_PASSWORD || "5056"
  }@${process.env.DB_HOST || "localhost"}:${process.env.DB_PORT || 5432}/${
    process.env.DB_NAME || "kitobxona"
  }`;

// Sequelize obyektini yaratamiz
export const sequelize = new Sequelize(dbUrl, {
  dialect: "postgres",
  logging: false, // SQL loglarini yashirish
});

// 🔗 Ulanishni tekshirish funksiyasi
export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connection established successfully!");
  } catch (error) {
    console.error("❌ Database connection failed:", error);
  }
};
