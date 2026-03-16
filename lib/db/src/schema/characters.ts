import { pgTable, serial, text, integer, boolean, json, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const charactersTable = pgTable("characters", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  name: text("name").notNull(),
  genome: text("race"),
  cadre: text("cadre"),
  class: text("class"),
  subclass: text("subclass"),
  background: text("background"),
  level: integer("level").notNull().default(1),
  experiencePoints: integer("experience_points").notNull().default(0),
  alignment: text("alignment"),
  playerName: text("player_name"),
  age: text("age"),
  height: text("height"),
  weight: text("weight"),
  eyes: text("eyes"),
  skin: text("skin"),
  hair: text("hair"),
  backstory: text("backstory"),
  notes: text("notes"),
  strength: integer("strength").notNull().default(10),
  dexterity: integer("dexterity").notNull().default(10),
  constitution: integer("constitution").notNull().default(10),
  intelligence: integer("intelligence").notNull().default(10),
  wisdom: integer("wisdom").notNull().default(10),
  charisma: integer("charisma").notNull().default(10),
  mosaicScore: integer("mosaic_score").notNull().default(0),
  maxHitPoints: integer("max_hit_points").notNull().default(8),
  currentHitPoints: integer("current_hit_points").notNull().default(8),
  temporaryHitPoints: integer("temporary_hit_points").notNull().default(0),
  armorClass: integer("armor_class").notNull().default(10),
  damageReduction: integer("damage_reduction").notNull().default(0),
  speed: integer("speed").notNull().default(30),
  initiative: integer("initiative").notNull().default(0),
  hitDice: text("hit_dice"),
  deathSaveSuccesses: integer("death_save_successes").notNull().default(0),
  deathSaveFailures: integer("death_save_failures").notNull().default(0),
  inspiration: boolean("inspiration").notNull().default(false),
  proficiencyBonusOverride: integer("proficiency_bonus_override"),
  savingThrowProficiencies: json("saving_throw_proficiencies").$type<string[]>().notNull().default([]),
  skillProficiencies: json("skill_proficiencies").$type<string[]>().notNull().default([]),
  skillExpertise: json("skill_expertise").$type<string[]>().notNull().default([]),
  senses: json("senses").$type<{
    acuteOlfaction: boolean;
    darkvision: boolean;
    macrovision: boolean;
    microvision: boolean;
    penetration: boolean;
    spectrum: boolean;
  }>().notNull().default({
    acuteOlfaction: false,
    darkvision: false,
    macrovision: false,
    microvision: false,
    penetration: false,
    spectrum: false,
  }),
  languages: text("languages"),
  toolProficiencies: text("tool_proficiencies"),
  armorProficiencies: text("armor_proficiencies"),
  weaponProficiencies: text("weapon_proficiencies"),
  attacks: json("attacks").notNull().default([]),
  hacks: json("spells").notNull().default([]),
  hackingAbility: text("spellcasting_ability"),
  hackSaveDC: integer("spell_save_dc"),
  hackAttackBonus: integer("spell_attack_bonus"),
  hackSlots: json("spell_slots").notNull().default({}),
  equipment: json("equipment").notNull().default([]),
  currency: json("currency").notNull().default({ satoshi: 0 }),
  features: json("features").notNull().default([]),
  geneMods: json("gene_mods").notNull().default([]),
  cybernetics: json("cybernetics").notNull().default([]),
  conditions: json("conditions").$type<string[]>().notNull().default([]),
  exhaustionLevel: integer("exhaustion_level").notNull().default(0),
  passivePerception: integer("passive_perception"),
  equippedArmor: text("equipped_armor"),
  portraitUrl: text("portrait_url"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  deletedAt: timestamp("deleted_at"),
});

export const insertCharacterSchema = createInsertSchema(charactersTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertCharacter = z.infer<typeof insertCharacterSchema>;
export type Character = typeof charactersTable.$inferSelect;
