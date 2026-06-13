import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { User } from "../models/user.js";

dotenv.config();

// 🛡️ Tokenni tekshirish
export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Token topilmadi" });
    }

    // 🔍 Tokenni tekshiramiz
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secretkey");
    if (!decoded?.id) {
      return res.status(403).json({ message: "Token noto‘g‘ri" });
    }

    // 🧠 Foydalanuvchini bazadan topamiz
    const user = await User.findByPk(decoded.id);
    if (!user) {
      return res.status(404).json({ message: "Foydalanuvchi topilmadi" });
    }

    // ✅ Foydalanuvchini so‘rovga biriktiramiz
    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    next();
  } catch (error) {
    console.error("Auth middleware xato:", error);
    return res.status(403).json({ message: "Token noto‘g‘ri yoki muddati o‘tgan" });
  }
};

// 🔐 Faqat adminlar uchun ruxsat
export const requireAdmin = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ message: "Admin kirish huquqi kerak" });
  }
  next();
};
