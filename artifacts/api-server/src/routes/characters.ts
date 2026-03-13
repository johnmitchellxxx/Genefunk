import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { charactersTable } from "@workspace/db/schema";
import { eq, and } from "drizzle-orm";
import {
  CreateCharacterBody,
  UpdateCharacterBody,
  GetCharacterParams,
  UpdateCharacterParams,
  DeleteCharacterParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/characters", async (req, res) => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  try {
    const characters = await db
      .select({
        id: charactersTable.id,
        name: charactersTable.name,
        race: charactersTable.race,
        class: charactersTable.class,
        level: charactersTable.level,
        updatedAt: charactersTable.updatedAt,
      })
      .from(charactersTable)
      .where(eq(charactersTable.userId, req.user.id));

    res.json(characters);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/characters", async (req, res) => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const parsed = CreateCharacterBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  try {
    const [character] = await db
      .insert(charactersTable)
      .values({
        userId: req.user.id,
        name: parsed.data.name,
      })
      .returning();

    res.status(201).json(character);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/characters/:id", async (req, res) => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const parsed = GetCharacterParams.safeParse({ id: Number(req.params.id) });
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid character id" });
    return;
  }

  try {
    const [character] = await db
      .select()
      .from(charactersTable)
      .where(
        and(
          eq(charactersTable.id, parsed.data.id),
          eq(charactersTable.userId, req.user.id)
        )
      );

    if (!character) {
      res.status(404).json({ error: "Character not found" });
      return;
    }

    res.json(character);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/characters/:id", async (req, res) => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const paramsParsed = UpdateCharacterParams.safeParse({ id: Number(req.params.id) });
  if (!paramsParsed.success) {
    res.status(400).json({ error: "Invalid character id" });
    return;
  }

  const bodyParsed = UpdateCharacterBody.safeParse(req.body);
  if (!bodyParsed.success) {
    res.status(400).json({ error: bodyParsed.error.message });
    return;
  }

  try {
    const existing = await db
      .select({ id: charactersTable.id })
      .from(charactersTable)
      .where(
        and(
          eq(charactersTable.id, paramsParsed.data.id),
          eq(charactersTable.userId, req.user.id)
        )
      );

    if (!existing.length) {
      res.status(404).json({ error: "Character not found" });
      return;
    }

    const data = bodyParsed.data;
    const [updated] = await db
      .update(charactersTable)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(charactersTable.id, paramsParsed.data.id),
          eq(charactersTable.userId, req.user.id)
        )
      )
      .returning();

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/characters/:id", async (req, res) => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const parsed = DeleteCharacterParams.safeParse({ id: Number(req.params.id) });
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid character id" });
    return;
  }

  try {
    const [deleted] = await db
      .delete(charactersTable)
      .where(
        and(
          eq(charactersTable.id, parsed.data.id),
          eq(charactersTable.userId, req.user.id)
        )
      )
      .returning({ id: charactersTable.id });

    if (!deleted) {
      res.status(404).json({ error: "Character not found" });
      return;
    }

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
