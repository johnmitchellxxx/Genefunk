import { pgTable, text, json, timestamp } from "drizzle-orm/pg-core";

export const dicePrefsTable = pgTable("dice_preferences", {
  userId: text("user_id").primaryKey(),
  config: json("config").notNull().default({}),
  presets: json("presets").notNull().default([]),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type DicePrefs = typeof dicePrefsTable.$inferSelect;
