import { pgTable, text, serial, integer, boolean, timestamp, varchar, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  avatar: text("avatar").default("https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=128&h=128&q=80"),
  isOnline: boolean("is_online").default(false),
  lastSeen: timestamp("last_seen").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
  bio: text("bio").default(""),
  location: text("location").default(""),
  friendIds: json("friend_ids").$type<number[]>().default([]),
  pendingFriendIds: json("pending_friend_ids").$type<number[]>().default([]),
});

// Schema para inserção de usuário (registro)
export const insertUserSchema = createInsertSchema(users).pick({
  email: true,
  password: true,
  name: true,
  avatar: true,
});

// Schema para login
export const loginUserSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
});

// Schema estendido para validação de registro
export const registerUserSchema = insertUserSchema.extend({
  email: z.string().email("Email inválido").refine(
    (email) => email.endsWith("@gmail.com"),
    {
      message: "Apenas emails do Gmail são permitidos (@gmail.com)",
    }
  ),
  password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
  confirmPassword: z.string().min(6, "Confirmação de senha deve ter no mínimo 6 caracteres"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type LoginUser = z.infer<typeof loginUserSchema>;
export type RegisterUser = z.infer<typeof registerUserSchema>;
export type User = typeof users.$inferSelect;
