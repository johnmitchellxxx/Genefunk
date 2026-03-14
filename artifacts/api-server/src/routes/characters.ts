import { Router, type IRouter } from "express";
import { db, createEstebanSeedData } from "@workspace/db";
import { charactersTable } from "@workspace/db/schema";
import { eq, and, isNull, isNotNull } from "drizzle-orm";
import { runWeeklyBackup } from "../services/backup";
import {
  CreateCharacterBody,
  UpdateCharacterBody,
  GetCharacterParams,
  UpdateCharacterParams,
  DeleteCharacterParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

const ADMIN_USER_ID = "john";

const seededUsers = new Set<string>();

async function ensureSeedCharacter(userId: string) {
  if (seededUsers.has(userId)) return;

  const estebanExists = await db
    .select({ id: charactersTable.id })
    .from(charactersTable)
    .where(
      and(
        eq(charactersTable.userId, userId),
        eq(charactersTable.name, "Esteban")
      )
    )
    .limit(1);

  if (estebanExists.length === 0) {
    try {
      const seedData = createEstebanSeedData(userId);
      await db.insert(charactersTable).values(seedData);
    } catch (err: unknown) {
      if (err instanceof Error && err.message.includes("duplicate")) {
        // concurrent request already inserted Esteban
      } else {
        throw err;
      }
    }
  }

  seededUsers.add(userId);
}

router.get("/characters", async (req, res) => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  try {
    const isAdmin = req.user.id === ADMIN_USER_ID;

    await ensureSeedCharacter(req.user.id);

    const characters = await db
      .select({
        id: charactersTable.id,
        name: charactersTable.name,
        genome: charactersTable.genome,
        class: charactersTable.class,
        level: charactersTable.level,
        updatedAt: charactersTable.updatedAt,
        userId: charactersTable.userId,
        deletedAt: charactersTable.deletedAt,
      })
      .from(charactersTable)
      .where(
        isAdmin
          ? isNull(charactersTable.deletedAt)
          : and(eq(charactersTable.userId, req.user.id), isNull(charactersTable.deletedAt))
      );

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

// Manual backup trigger — admin only, must come BEFORE /characters/:id
router.post("/characters/backup", async (req, res) => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  if (req.user.id !== ADMIN_USER_ID) {
    res.status(403).json({ error: "Forbidden" });
    return;
  }

  try {
    const result = await runWeeklyBackup();
    res.json({ success: true, ...result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Backup failed" });
  }
});

// Must come BEFORE /characters/:id so Express doesn't treat "trash" as an id
router.get("/characters/trash", async (req, res) => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  if (req.user.id !== ADMIN_USER_ID) {
    res.status(403).json({ error: "Forbidden" });
    return;
  }

  try {
    const characters = await db
      .select({
        id: charactersTable.id,
        name: charactersTable.name,
        genome: charactersTable.genome,
        class: charactersTable.class,
        level: charactersTable.level,
        updatedAt: charactersTable.updatedAt,
        userId: charactersTable.userId,
        deletedAt: charactersTable.deletedAt,
      })
      .from(charactersTable)
      .where(isNotNull(charactersTable.deletedAt));

    res.json(characters);
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

  const isAdmin = req.user.id === ADMIN_USER_ID;

  try {
    const [character] = await db
      .select()
      .from(charactersTable)
      .where(
        isAdmin
          ? and(eq(charactersTable.id, parsed.data.id), isNull(charactersTable.deletedAt))
          : and(
              eq(charactersTable.id, parsed.data.id),
              eq(charactersTable.userId, req.user.id),
              isNull(charactersTable.deletedAt)
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

  const isAdmin = req.user.id === ADMIN_USER_ID;

  try {
    const existing = await db
      .select({ id: charactersTable.id })
      .from(charactersTable)
      .where(
        isAdmin
          ? and(eq(charactersTable.id, paramsParsed.data.id), isNull(charactersTable.deletedAt))
          : and(
              eq(charactersTable.id, paramsParsed.data.id),
              eq(charactersTable.userId, req.user.id),
              isNull(charactersTable.deletedAt)
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
      .where(eq(charactersTable.id, paramsParsed.data.id))
      .returning();

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Soft delete — moves character to trash
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

  const isAdmin = req.user.id === ADMIN_USER_ID;

  try {
    const [updated] = await db
      .update(charactersTable)
      .set({ deletedAt: new Date() })
      .where(
        isAdmin
          ? and(eq(charactersTable.id, parsed.data.id), isNull(charactersTable.deletedAt))
          : and(
              eq(charactersTable.id, parsed.data.id),
              eq(charactersTable.userId, req.user.id),
              isNull(charactersTable.deletedAt)
            )
      )
      .returning({ id: charactersTable.id });

    if (!updated) {
      res.status(404).json({ error: "Character not found" });
      return;
    }

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Restore from trash (admin only)
router.post("/characters/:id/restore", async (req, res) => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  if (req.user.id !== ADMIN_USER_ID) {
    res.status(403).json({ error: "Forbidden" });
    return;
  }

  const parsed = DeleteCharacterParams.safeParse({ id: Number(req.params.id) });
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid character id" });
    return;
  }

  try {
    const [updated] = await db
      .update(charactersTable)
      .set({ deletedAt: null })
      .where(
        and(
          eq(charactersTable.id, parsed.data.id),
          isNotNull(charactersTable.deletedAt)
        )
      )
      .returning({ id: charactersTable.id });

    if (!updated) {
      res.status(404).json({ error: "Character not found in trash" });
      return;
    }

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Permanently delete (admin only, irreversible)
router.delete("/characters/:id/permanent", async (req, res) => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  if (req.user.id !== ADMIN_USER_ID) {
    res.status(403).json({ error: "Forbidden" });
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
      .where(eq(charactersTable.id, parsed.data.id))
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
