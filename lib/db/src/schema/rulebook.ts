import { pgTable, serial, text, integer, json } from "drizzle-orm/pg-core";

export const rulebookClassesTable = pgTable("rulebook_classes", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  description: text("description").notNull(),
  hitDie: integer("hit_die").notNull(),
  primaryAbility: text("primary_ability").notNull(),
  savingThrows: json("saving_throws").$type<string[]>().notNull(),
  armorProficiencies: json("armor_proficiencies").$type<string[]>().notNull().default([]),
  weaponProficiencies: json("weapon_proficiencies").$type<string[]>().notNull().default([]),
  skillChoices: json("skill_choices").$type<string[]>().notNull().default([]),
  numSkillChoices: integer("num_skill_choices").notNull().default(2),
  featuresByLevel: json("features_by_level").$type<Record<string, { name: string; description: string }[]>>().notNull().default({}),
  subclasses: json("subclasses").$type<{ name: string; description: string }[]>().notNull().default([]),
});

export const rulebookBackgroundsTable = pgTable("rulebook_backgrounds", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  description: text("description").notNull(),
  skillProficiencies: json("skill_proficiencies").$type<string[]>().notNull().default([]),
  vocationalProficiency: text("vocational_proficiency"),
  featureName: text("feature_name").notNull(),
  featureDescription: text("feature_description").notNull(),
  equipment: text("equipment"),
  languages: text("languages"),
});

export const rulebookGenomesTable = pgTable("rulebook_genomes", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  category: text("category").notNull(),
  description: text("description").notNull(),
  abilityBonuses: json("ability_bonuses").$type<Record<string, number>>().notNull().default({}),
  senses: json("senses").$type<string[]>().notNull().default([]),
  traits: json("traits").$type<{ name: string; description: string }[]>().notNull().default([]),
  speed: integer("speed").notNull().default(9),
});

export type RulebookClass = typeof rulebookClassesTable.$inferSelect;
export type RulebookBackground = typeof rulebookBackgroundsTable.$inferSelect;
export type RulebookGenome = typeof rulebookGenomesTable.$inferSelect;
