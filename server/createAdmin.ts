import { db } from "./db";
import { users } from "@shared/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

export async function createFirstAdmin() {
  try {
    console.log("Начинаем создание администратора...");
    const adminEmail = process.env.ADMIN_DEFAULT_EMAIL || "admin@pension.ru";
    const adminPassword = process.env.ADMIN_DEFAULT_PASSWORD || "admin123";
    console.log("Используем email:", adminEmail);

    // Check if admin already exists
    console.log("Проверяем существующего администратора...");
    const [existingAdmin] = await db
      .select()
      .from(users)
      .where(eq(users.email, adminEmail));

    if (existingAdmin) {
      console.log("Администратор уже существует:", adminEmail);
      return existingAdmin;
    }

    console.log("Создаем нового администратора...");
    // Create new admin
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    
    const [newAdmin] = await db
      .insert(users)
      .values({
        email: adminEmail,
        password: hashedPassword,
        firstName: "Администратор",
        lastName: "Системы",
        isAdmin: true,
      })
      .returning();

    console.log("Создан администратор:", adminEmail);
    console.log("Пароль:", adminPassword);
    console.log("⚠️  Обязательно смените пароль после первого входа!");
    
    return newAdmin;
  } catch (error: any) {
    console.error("Ошибка создания администратора. Детали:", {
      message: error.message,
      stack: error.stack,
      code: error.code,
      detail: error.detail
    });
    throw error;
  }
}